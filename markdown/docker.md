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





<br>

### Containers

<hr>

Create and run a container from an image :
```md
docker run --name <container_name> <image_name>
```

Start/stop a container :
```md
docker start|stop <container_name> (or <container-id>)
```

Run a container with and publish a container’s port(s) to the host :
```md
docker run -p <host_port>:<container_port> <image_name>
```

Run a container in background-mode :
```md
docker run -d <image_name>
```

Remove a stopped container :
```md
docker rm <container_name>
```

<hr>

Open a shell inside a running container :
```md
docker exec -it <container_name> sh
```

Fetch and follow the logs of a container :
```md
docker logs -f <container_name>
```

<hr>

Inspect a running container *(full JSON export)* :
```md
docker inspect <container_name> (or <container_id>)
```

View resource usage stats :
```md
docker container stats
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
docker-compose run <task_name> -d
```





<br>

### Images

<hr>

Build an Image from a Dockerfile :
```md
docker build -t <image_name>
```

Delete an Image :
```md
docker rmi <image_name>
```

Remove all unused images :
```md
docker image prune
```





<br>

### Docker Hub

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
