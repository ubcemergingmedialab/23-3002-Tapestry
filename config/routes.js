const parseParams = route => {
  const parsedParams = {}
  for (const key in route.params) {
    const val = route.params[key]
    parsedParams[key] = Number(val)
  }
  return parsedParams
}

export const names = {
  APP: "app",
  LIGHTBOX: "lightbox",
  MODAL: "modal",
  SETTINGS: "settings",
  LINKMODAL: "linkmodal",
  USERANSWERS: "userAnswers",
  USERSETTINGS: "userSettings",
  HELP: "help",
  EMBED: "embed",
  EXPORTDUPLICATE: "exportDuplicate",
  KALTURAMODAL: "kalturaModal",
  OTHEROPERATIONS: "otherOperations",
  ML: "tapestryML", // Added Tapestry path name
}

const ROOT_PATH = `/nodes/:nodeId(\\d+)`

export default [
  {
    path: '/',
    redirect: '/tapestry-ml' // This is going to make the Tapestry ML page the first one
  },
  {
    path: ROOT_PATH,
    name: names.APP,
    children: [
      {
        path: `view/:rowId(\\d+)?`,
        name: names.LIGHTBOX,
        props: {
          lightbox: parseParams,
        },
      },
      {
        path: `:type(add|edit)`,
        redirect: `${ROOT_PATH}/:type/content`,
      },
      {
        path: `:type(add|edit)/:rowId(\\d+)`,
        redirect: `${ROOT_PATH}/:type/:rowId(\\d+)/content`,
      },
      {
        path: `:type(add|edit)/:rowId(\\d+)?/:tab`,
        name: names.MODAL,
      },
      {
        path: `link/:source/:target`,
        name: names.LINKMODAL,
      },
      {
        path: `settings`,
        redirect: `${ROOT_PATH}/settings/appearance`,
        children: [
          {
            path: `:tab`,
            name: names.SETTINGS,
          },
        ],
      },
      {
        path: `user-answers`,
        redirect: `${ROOT_PATH}/user-answers/answers`,
        children: [
          {
            path: `:tab`,
            name: names.USERANSWERS,
          },
        ],
      },
      {
        path: `user-settings`,
        redirect: `${ROOT_PATH}/user-settings/theme`,
        children: [
          {
            path: `:tab`,
            name: names.USERSETTINGS,
          },
        ],
      },
      {
        path: `help`,
        name: names.HELP,
      },
      {
        path: `embed`,
        name: names.EMBED,
      },
      {
        path: `export-duplicate`,
        name: names.EXPORTDUPLICATE,
      },
      {
        path: `kalturamodal`,
        redirect: `${ROOT_PATH}/kalturamodal/upload`,
        children: [
          {
            path: `:tab`,
            name: names.KALTURAMODAL,
          },
        ],
      },
      {
        path: `other-operations`,
        name: names.OTHEROPERATIONS,
      },
      {
        path: 'tapestry-ml', // Added a tapestry ML path 
        name: names.ML,
        component: () => import('@/components/TapestryMLFirstPage.vue'),
      }
    ],
  }
]
