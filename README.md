# ImageStore

A drag and drop write only image uploader for firebase storage.

Upload an image, and get an image url to use in your app.
Upload is restricted to certain users using firebase storage rules. Not 100% secure, but good enough for most use cases.

Uploaded Images are read using a CF to provide a shorter url. The provided links are then wrapped with the [cloudimage.io image proxy service](https://cloudimage.io) for improved performance and lower CF costs.
