# 1. Use an official Node.js runtime AS A MIRROR from ECR Public Gallery
FROM public.ecr.aws/docker/library/node:18-alpine 

# 2. Set the working directory in the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install app dependencies
RUN npm install --only=production --ignore-scripts

# 5. Bundle app source code
COPY . .

# 6. Expose the port
EXPOSE 3000

# 7. Define the command to run your app
CMD ["node", "server.js"]