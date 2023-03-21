# asterviz SETUP
(All commands are with respect to the root directory of the project)

> Clone repository
> Copy and configure .env file (cp backend/.env.example backend/.env)
> Install dependencies (cd backend/ && pnpm install)
> Start database (docker compose up postgres)
> Reset prior Typeorm setup (cd backend/ && pnpm typeorm:drop)
> Migrate database (cd backend/ && pnpm migration:run)
> Seed Database (cd backend/ && pnpm seed)
> Test backend ( cd backend/ && pnpm test)
> Start backend (cd backend/ && pnpm dev)

### Auto-generating migration file from current Models

This is ONLY NEEDED during our initial development in-class!
Once you clone the repository with the migrations already in it,
you ONLY do the above!
> pnpm typeorm:drop
> pnpm migration:generate ./src/db/migrations/initialize.ts

# VM setup (Ubuntu 22.04.2 LTS)
## On clean install:
* sudo apt-get install virtualbox-guest-additions-iso
* sudo apt update && sudo apt upgrade
* sudo apt install -y curl

### Docker install
* sudo apt install apt-transport-https ca-certificates curl software-properties-common gnupg lsb-release
* sudo mkdir -p /etc/apt/keyrings
* curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
* echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu jammy stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
* sudo chmod a+r /etc/apt/keyrings/docker.gpg
* sudo apt update
* sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
* sudo systemctl start docker
* sudo systemctl enable docker
    * sudo docker run hello-world
    * Docker is now installed! Next we'll install rootless access
* sudo apt install uidmap dbus-user-session
* sudo systemctl disable --now docker.service docker.socket
* /usr/bin/dockerd-rootless-setuptool.sh install
* systemctl --user start docker
* systemctl --user enable docker
* sudo loginctl enable-linger kc
    * cd ~ && docker run hello-world

### Node install
*  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
* sudo apt install -y nodejs
* sudo npm install -g pnpm

### Download prep
* sudo apt install git
* [cd to new directory]

### Setup
* git clone https://github.com/maxoakes/AsterViz.git
* cd AsterViz/
* Run:
    * cp frontend/.env.example frontend/.env
    * cp backend/.env.example backend/.env
    * cp routeCS/MyRoute/.env.example routeCS/MyRoute/.env
* Or:
    * chmod +x ./env.sh
    * sudo ./env.sh