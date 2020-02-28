module.exports = {
    makers: [
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                iconUrl: 'https://github.com/jusola/ticked/blob/master/build/icon.ico?raw=true'
            }
        },
        {
            name: '@electron-forge/maker-zip',
        }
    ],
    publishers:[
        {
            name: '@electron-forge/publisher-github',
            config: {
              repository: {
                owner: 'jusola',
                name: 'ticked'
              },
              prerelease: true
            }
          }
    ]
}