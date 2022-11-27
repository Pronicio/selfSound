export function createApiContext(ytcfg) {
    return {
        context: {
            capabilities: {},
            client: {
                clientName: ytcfg.INNERTUBE_CLIENT_NAME,
                clientVersion: ytcfg.INNERTUBE_CLIENT_VERSION,
                experimentIds: [],
                experimentsToken: "",
                gl: ytcfg.GL,
                hl: ytcfg.HL,
                locationInfo: {
                    locationPermissionAuthorizationStatus: "LOCATION_PERMISSION_AUTHORIZATION_STATUS_UNSUPPORTED",
                },
                musicAppInfo: {
                    musicActivityMasterSwitch: "MUSIC_ACTIVITY_MASTER_SWITCH_INDETERMINATE",
                    musicLocationMasterSwitch: "MUSIC_LOCATION_MASTER_SWITCH_INDETERMINATE",
                    pwaInstallabilityStatus: "PWA_INSTALLABILITY_STATUS_UNKNOWN",
                },
                utcOffsetMinutes: -new Date().getTimezoneOffset(),
            },
            request: {
                internalExperimentFlags: [ {
                    key: "force_music_enable_outertube_tastebuilder_browse",
                    value: "true",
                },
                    {
                        key: "force_music_enable_outertube_playlist_detail_browse",
                        value: "true",
                    },
                    {
                        key: "force_music_enable_outertube_search_suggestions",
                        value: "true",
                    },
                ],
                sessionIndex: {},
            },
            user: {
                enableSafetyMode: false,
            },
        }
    }
}

export function getCategoryURI(categoryName) {
    let b64Key = ''

    switch (categoryName.toUpperCase()) {
        case 'SONG':
            b64Key = 'RAAGAAgACgA'
            break
        case 'VIDEO':
            b64Key = 'BABGAAgACgA'
            break
        case 'ALBUM':
            b64Key = 'BAAGAEgACgA'
            break
        case 'ARTIST':
            b64Key = 'BAAGAAgASgA'
            break
        case 'PLAYLIST':
            b64Key = 'BAAGAAgACgB'
            break
    }

    if (b64Key.length > 0) {
        return `Eg-KAQwIA${b64Key}MABqChAEEAMQCRAFEAo%3D`
    } else {
        return null
    }
}
