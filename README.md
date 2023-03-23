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

# Run Docker + Setup
* git clone https://github.com/maxoakes/AsterViz.git
* cd AsterViz/
* Run:
    * cp frontend/.env.example frontend/.env
    * cp backend/.env.example backend/.env
    * cp routeCS/MyRoute/.env.example routeCS/MyRoute/.env
* Or:
    * chmod +x ./env.sh
    * ./env.sh
* Finally:
    * docker compose up
    * Navigate to http://localhost:5000

### Cleanup
To fully wipe all images
* docker stop $(docker ps -a -q)
* docker rm $(docker ps -a -q)
* docker rmi $(docker images -q)
* rm -rf AsterViz/

# Docker not fully working?
## Run the project in a dev environment
Start everything but the backend
* docker compose up postgres minio routecs frontend

Go to backend and initialize it, then start it
* pnpm i
* pnpm migration:run
* pnpm seed
* pnpm dev

Done!
* Navigate to localhost:5000

# Other
### migration routine
(All commands are with respect to the root directory of the project)

* pnpm typeorm:drop
* pnpm migration:generate ./src/db/migrations/initialize
* change import in dev_datasource and migration object
* pnpm migration:run
* pnpm seed
