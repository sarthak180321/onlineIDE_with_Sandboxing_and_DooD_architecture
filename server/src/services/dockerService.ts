import Dockerode from "dockerode";
const docker = new Dockerode();
export const createContainer = async (userId: string): Promise<string> => {
    console.log('DOCKER_NETWORK value:', process.env.DOCKER_NETWORK)
    console.log('BASE_IMAGE value:', process.env.BASE_IMAGE)
    try{
    const containers = await docker.listContainers({ all: true });
    const existing = containers.find(c => c.Names.includes(`/${userId}`));

    if (existing) {
         const container = docker.getContainer(existing.Id);
          if (existing.State !== 'running') {
                await container.start();
        }
        // return existing.Id;
        return existing.Id.substring(0, 12);
    }
     const container = await docker.createContainer({
            Image: process.env.BASE_IMAGE as string,
            name: userId,
            Cmd: ['/bin/sh'],
            Tty: true,
            OpenStdin: true,
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            NetworkingConfig: {
                EndpointsConfig: {
                    [process.env.DOCKER_NETWORK as string]: {}
                }
            },
            HostConfig: {
                NetworkMode: process.env.DOCKER_NETWORK as string,
                AutoRemove: false,
            }
        });

        await container.start();
        return container.id.substring(0, 12);
    }
    catch(err){
        console.error('Docker error:', err);
        throw new Error('Failed to create container');
    }
}

export const getContainer = (containerId: string): Dockerode.Container => {
    return docker.getContainer(containerId);
    
};

export const removeContainer = async (containerId: string): Promise<void> => {
    try {
        const container = docker.getContainer(containerId);
        const info = await container.inspect();

        if (info.State.Running) {
            await container.stop();
        }

        await container.remove();
    } catch (error) {
        console.error('Error removing container:', error);
        throw new Error('Failed to remove container');
    }
};