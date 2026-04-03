FROM ubuntu:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    vim \
    curl \
    wget \
    git \
    iputils-ping \
    net-tools \
    nodejs \
    npm \
    python3 \
    python3-pip \
    build-essential \
    unzip \
    zip \
    htop \
    tree \
    nano \
    bash \
    docker.io \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
CMD ["/bin/bash"]