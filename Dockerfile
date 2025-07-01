# Utilizzare l'immagine base di PHP con Apache
FROM php:8.2-apache

# Enable Apache ldap auth module
RUN a2enmod authnz_ldap

# Abilitare il modulo Apache per PHP
RUN docker-php-ext-install mysqli pdo pdo_mysql

# Esporre la porta su cui Apache ascolta
EXPOSE 80
