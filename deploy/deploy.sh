#!/usr/bin/env bash

set -x

LOCAL_IPS=$LOCAL_IPS
DEPLOY_USER=$DEPLOY_USER
BASTION_USER=$BASTION_USER
BASTION_IP=$BASTION_IP

tar -zcvf build.zip dist

mkdir -p ~/.ssh

touch ~/.ssh/config

echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config

echo -e "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa

chmod 600 ~/.ssh/id_rsa

ALL_LOCAL_SERVERS=(${LOCAL_IPS//,/ })

for server in "${ALL_LOCAL_SERVERS[@]}"
do
  #scp build.zip ec2-user@${server}:~

  scp -o ProxyCommand="ssh -tt -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null/ -W %h:%p ${BASTION_USER}@${BASTION_IP}" build.zip ${DEPLOY_USER}@${server}:~

  #ssh ec2-user@${server} 'bash -s' < ./deploy/install_and_restart.sh
  ssh -o ProxyCommand="ssh -tt -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null/ -W %h:%p ${BASTION_USER}@${BASTION_IP}" ${DEPLOY_USER}@${server} 'bash -s' < ./deploy/install_and_restart.sh
done
