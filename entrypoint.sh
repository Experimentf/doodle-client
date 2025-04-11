#!/bin/sh

# Substitute environment variables into the nginx config template
envsubst '${REACT_APP_DOODLE_SERVER_URL}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

# Run NGINX
exec nginx -g 'daemon off;'
