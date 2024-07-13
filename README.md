<h1 align="center">SeatSwap - Ticketing Booking Management System</h1>

SeatSwap is a microservices-based ticketing booking application leveraging event-driven architecture. It enables users to create and sell one-time tickets efficiently.

## <a name="tech-stack">⚙️ Tech Stack</a>

#### Development Stack

[![Stack Used](https://skillicons.dev/icons?i=js,typescript,nodejs,express,nextjs,jest,githubactions&theme=dark)](https://skillicons.dev)

#### Database and Data Storage

[![Stack Used](https://skillicons.dev/icons?i=mongodb,redis&theme=dark)](https://skillicons.dev)

#### Containerization and Orchestration:

[![Stack Used](https://skillicons.dev/icons?i=docker,kubernetes,&theme=dark)](https://skillicons.dev)

#### Web Server and Reverse Proxy:

[![Stack Used](https://skillicons.dev/icons?i=nginx,kafka&theme=dark)](https://skillicons.dev)

## 📝 Project Overview

This project utilizes a diverse tech stack to ensure seamless integration and collaboration among services. Communication between services is managed by the [NATS Streaming Server](https://nats.io/), which decentralizes the communication infrastructure. Skaffold is used to automate the development environment and manage repetitive tasks.

### Services:

- **Authentication**: Manages all user login and signup functionalities.
- **Client**: Handles all front-end functionalities.
- **Tickets**: Manages CRUD operations for tickets.
- **Orders**: Oversees all functionalities related to ticket ordering and order status, including `pending`, `cancelled`, and `completed`.
- **Payments**: Manages payment processes, including canceling payments and updating other services upon successful transactions.
- **Expiration**: Locks tickets for 2 minutes upon purchase, after which the tickets are unlocked.



## <a name="quick-start">🤸 Quick Start</a>
### Prerequisites

- Node.js
- Npm
- Docker
- Kubernetes
- Skaffold

### Installation

1. Clone the repository:
   
```bash
git clone https://github.com/Aryan7511/SeatSwap.git
```
2. Navigate to the project directory:
   
```bash
cd SeatSwap
```
3. Install dependencies for each service:
   navigate in each service `cd serviceName` and run `npm install`

4. Build Docker images for each service and push them to Docker Hub:

```bash
# Example for building and pushing an image
docker build -t your-dockerhub-username/service-name .
docker push your-dockerhub-username/service-name
```
5. Update Kubernetes YAML files and Skaffold configuration:
   - Navigate to infra/k8s/ directory.
   - Modify the image names in the YAML files to use your Docker Hub images.

6. Update the skaffold.dev file in the root directory:
   - Modify the image names in the skaffold.dev.yaml file to match your Docker Hub images.
  
7. Configure the accessing URL by updating the nginx host settings.

8. Ensure your Kubernetes cluster is running.

9. Start the development server: run `skaffold dev` in terminal and make sure you're in root directory
