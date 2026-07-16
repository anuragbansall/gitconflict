# Pulling Ubuntu 24.04 base image
FROM ubuntu:24.04

# Install git 
RUN apt-get update && \
    apt-get install -y git

# Set up git user configuration
RUN git config --global user.name "Git Challenge User"
RUN git config --global user.email "user@gitchallenge.dev"

# Set working directory to /workspace
WORKDIR /workspace

# Run the container in detached mode and keep it running
CMD ["tail", "-f", "/dev/null"]