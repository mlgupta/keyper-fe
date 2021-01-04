![Docker Image Version (latest by date)](https://img.shields.io/docker/v/dbsentry/keyper)
![Docker Image Size (latest by date)](https://img.shields.io/docker/image-size/dbsentry/keyper)
![GitHub issues](https://img.shields.io/github/issues/dbsentry/keyper)
![GitHub last commit](https://img.shields.io/github/last-commit/dbsentry/keyper)
![GitHub](https://img.shields.io/github/license/dbsentry/keyper)
![CodeQL](https://github.com/dbsentry/keyper/workflows/CodeQL/badge.svg)  
![Keyper Architecture](https://keyper.dbsentry.com/media/keyper.png)  

Keyper is an SSH Key/Certificate Authentication Manager. It standardizes and centralizes the storage of SSH public keys and SSH Public Certificates for all Linux users within your organization saving significant time and effort it takes to manage SSH public keys and certificates. Keyper is a lightweight container taking less than 100MB. It is launched either using Docker or Podman. You can be up and running within minutes instead of days.

Features include:
- Public key storage
- SSH CA
- Certificate signing and storage
- Public Key/Certificate Expiration
- Forced Key rotation
- Key Revocation List (KRL)
- Streamlined provision or de-provisioning of users
- Segmentation of Servers using groups
- Policy definition to restrict user's access to server(s)
- Centralized user account lockout
- Docker container

## Installation/Build
If you are looking to build docker image for Keyper SSH Key based authentication manager head over to [keyper-docker](https://github.com/dbsentry/keyper-docker) project.
Follow the steps to use this source code:
1. Clone this git repository
```console
$ git clone https://github.com/dbsentry/keyper-fe.git
```
2. Install ```npm``` packages
```console
$ cd keyper-fe
$ npm install
```
3. To run in dev mode:
```console
$ npm run dev
```
Refer to the [administration guide](https://keyper.dbsentry.com/docs/) for further information.

## Related Projects
- [keyper-docker](https://github.com/dbsentry/keyper-docker)
- [keyper](https://github.com/dbsentry/keyper)
- [Keyper-docs](https://github.com/dbsentry/keyper-docs)

## License
All assets and code are under the GNU GPL LICENSE and in the public domain unless specified otherwise.

Some files were sourced from other open source projects and are under their terms and license.
