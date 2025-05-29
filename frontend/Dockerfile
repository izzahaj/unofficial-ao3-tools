# Use node image for base image for all stages.
FROM node:24.1.0-alpine3.21 AS base

WORKDIR /app

FROM base AS prod-deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --production

FROM base AS dev-deps

# Download all dependencies, including development dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

FROM prod-deps AS build

# Copy the rest of the source files into the image.
COPY . .
# Run the build script.
CMD ["npm", "run", "build"]

FROM base AS prod

ENV NODE_ENV production

# Copy the production dependencies from the deps stage and also
# the built application from the build stage into the image.
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/. ./.

EXPOSE 3000

CMD ["npm", "run", "build"]

FROM base AS dev

# Use devlopment node environment by default.
ENV NODE_ENV development

# Install additional tools for development (e.g., Git, Bash)
RUN apk update && apk add --no-cache git bash

# Create a non-root user for better security
RUN addgroup -S docker && \
    adduser -S --shell /bin/bash --ingroup docker vscode

COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
    
# Expose the port that the application listens on.
EXPOSE 3000
CMD ["npm", "run", "dev"]
