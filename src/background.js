/* eslint-disable-next-line no-console */
console.log('gentleman background script loaded', new Date().toISOString())

const FALLBACK_URL = 'https://nhentai.net'
const BASE_URL = 'https://nhentai.net/g/'
const MENU_ID = 'GENTLEMAN_MENU_ID'

const NSFW_URL_PATTERNS = [
  'https://nhentai.net/*',
  'https://*.pornhub.com/*',
  'https://www.xvideos.com/*',
  'https://e-hentai.org/*'
]

const isNumber = v => !isNaN(Number(v))

const createNewTab = url => chrome.tabs.create({ url })

const createTabByNumber = text => {
  let url = FALLBACK_URL
  if (text.length > 6) text = text.slice(0, 6)
  if (isNumber(text)) url = BASE_URL + text
  createNewTab(url)
}

chrome.omnibox.onInputEntered.addListener(text => createTabByNumber(text))

chrome.contextMenus.create({
  id: MENU_ID,
  title: 'gentleman',
  contexts: ['all']
})

chrome.contextMenus.onClicked.addListener(info => {
  if (info.menuItemId === MENU_ID) createTabByNumber(info.selectionText)
})

chrome.commands.onCommand.addListener(async command => {
  /* eslint-disable-next-line no-console */
  console.log('trigger command', command)

  switch (command) {
    case 'push': {
      const queryJobs = NSFW_URL_PATTERNS.map(url => chrome.tabs.query({ url }))
      const tabGroups = await Promise.all(queryJobs)
      const tabs = tabGroups.flat()
      const tabIds = tabs.map(tab => tab.id)
      chrome.tabs.remove(tabIds)
    }
  }
})
