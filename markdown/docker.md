---
layout: default
permalink: /docker
---

# Docker Cheatsheet





<br>

### General Commands

<hr>

Start the docker daemon :
```md
docker -d
```

Display system-wide information :
```md
docker info
```

List local images :
```md
docker images
```

List containers :
```md
docker ps
docker ps -a
```

Display memory/CPU usage for all containers :
```md
docker container stats
```





<br>

### Images

<hr>

List all available images :
```md
docker image ls
```

Build an Image from a Dockerfile :
```md
docker build <image_name> <folder_to_build>
docker build -t <image_name>(:<tag>) <folder_to_build>
docker build -t app:dev .
```

Delete an Image :
```md
docker image rm <image>
```

Remove all unused images :
```md
docker image prune
```





<br>

### Containers

<hr>

Create and run a container from an image :
```md
docker run --name <container_name> <image>
```

Start/stop a container :
```md
docker start|stop <container_name> (or <container-id>)
```

Run a container with and publish a container’s port(s) to the host :
```md
docker run -p <host_port>:<container_port> <image>
```

Run a container in background-mode :
```md
docker run -d <image>
```

Remove a stopped container :
```md
docker rm <container>
```

<hr>

Open a shell inside a running container :
```md
docker exec -it <container> bash
```

Display the logs of a container :
```md
docker logs <container>
docker logs -f <container>                    # tail -f
docker logs --tail 100 <container>            # tail -100
docker logs --follow --until=30m              # last 30m
docker logs --since 2023-01-01 <container>    # since 2023/01/01
```

Copy a local file into a container :
```md
docker cp <local_file> <container>:<target_folder>
```

Copy a file from a container :
```md
docker cp <container>:<file> <local_destination>
```

<hr>

Inspect a running container *(full JSON export)* :
```md
docker inspect <container>
```





<br>

### Docker Compose

<hr>


Executes a `docker-compose.yml` file *(includes build if containers do not exist yet)* :
```md
docker-compose up -d
```

Start/stop an existing `docker-compose` :
```md
docker-compose start
docker-compose stop
```

Executes only 1 specific task from the `docker-compose.yml` file :
```md
docker-compose pull <task_name>
docker-compose run -d <task_name>
docker-compose up -d <task_name>
```





<br>

### Docker Hub / Repository

<hr>

Login into a private repository, to avoid copying SSH keys everywhere !
```md
docker login <private_repo_url>
```

<hr>

Login :
```md
docker login -u <username>
```

Pull an image from a Docker Hub :
```md
docker pull <image_name>
```

Search Hub for an image :
```md
docker search <image_name>
```

Publish an image to Docker Hub :
```md
docker push <username>/<image_name>
```
