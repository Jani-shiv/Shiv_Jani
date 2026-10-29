# Q-3: Create Docker Container with Volume and Deploy Website

Run the following commands in **Command Prompt (cmd)**:

---

### Step 1: Create Docker volume named `gujvolume1`
```cmd
docker volume create gujvolume1
```

---

### Step 2: Run Apache (httpd) container and map `gujvolume1` to the container path
```cmd
docker run -d --name apache-site -p 8085:80 -v gujvolume1:/usr/local/apache2/htdocs httpd
```

---

### Step 3: Upload website files into the mapped volume folder
*(Run from inside the `shiv-jani-portfolio` project folder)*
```cmd
docker cp . apache-site:/usr/local/apache2/htdocs/
```

---

### Step 4: Access the website in a web browser
Open your browser and navigate to:
```
http://localhost:8085
```

---

### Step 5: Verify volume mounting and website deployment
- **Verify volume mount on container:**
  ```cmd
  docker inspect apache-site --format "{{json .Mounts}}"
  ```

- **Verify volume details:**
  ```cmd
  docker volume inspect gujvolume1
  ```

- **Verify files inside the mounted directory:**
  ```cmd
  docker exec apache-site ls -la /usr/local/apache2/htdocs/
  ```

---

### (Optional) Cleanup Commands
```cmd
docker stop apache-site
docker rm apache-site
docker volume rm gujvolume1
```
