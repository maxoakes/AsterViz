# Install
`sudo apt install dotnet-sdk-6.0`
`wget https://dot.net/v1/dotnet-install.sh -O dotnet-install.sh`
`sudo chmod +x ./dotnet-install.sh`
`./dotnet-install.sh --version latest`
`export DOTNET_ROOT=$HOME/.dotnet`
`export PATH=$PATH:$HOME/.dotnet:$HOME/.dotnet/tools`

# packages
`dotnet add package Microsoft.Data.SqlClient`
`dotnet add package Npgsql --version 7.0.2`

# Init Creation
`dotnet new webapi -o MyMicroservice --no-https -f net6.0`

# Build
`sudo docker build -t myroute .`
`docker run -it --rm -p 3000:80 --name myroutecontainer myroute`