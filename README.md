# Cicada
Website for composing and sharing Chiptunes.

## About
Chiptunes are programs that create music by sending commands to an audio synthesizer. They offer a high level of control over the composition, but require a high level of precision. This makes Chiptune writing a great way to introduce music composition to anyone with a tech background: if you can push numbers into an array, you can write a song! The website is currently unfinished, but will provide the following features:
- [X] User authentication (register / login / logout)
- [X] A song editor
- [X] Can play chiptunes made with the editor
- [ ] Save and Load songs
- [ ] Publish songs
- [ ] Share songs via url
- [ ] View user profiles with published songs

## Tech Stack
The website is built from the cloud server up, using the following technologies:
* Amazon Cloud: hosting
* NginX: TSL, static file serving, reverse proxy
* Postgres: database
* Node.js, Express: HTTP server, CRUD operations
* Vue.js: front-end framework
* [JacobABrennan/APU](https://github.com/jacobabrennan/apu): audio synthesizer

## Live Demo
A live demo exists at [Cicada.zone](https://cicada.zone).
