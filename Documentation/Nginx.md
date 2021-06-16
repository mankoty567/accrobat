# Nginx
[Nginx](https://www.nginx.com/)

Si vous n'avez pas configuré de Nginx, voici ci dessous deux exemple de configurations de sites, à mettre dans `/etc/nginx/sites-enabled`.
```
server {
  server_name VOTRE_HOST_DU_BACK;

  location / {
    proxy_pass http://127.0.0.1:VOTRE_PORT;
  } 
  proxy_read_timeout 300;

  client_max_body_size 10m;
}
```

```
server {
  server_name VOTRE_HOST_DU_FRONT;

  location / {
    root LE_CHEMIN_VERS_BUILD;
    try_files $uri /index.html;
  }
}
```

Sur votre configuration DNS, mettez en place deux redirection vers votre IP, une pour le front et une pour le back.