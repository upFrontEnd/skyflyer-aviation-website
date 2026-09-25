import './styles/main.scss'

import { renderHeader, mountHeader } from './components/Header.js'
import { renderLiveStream } from './components/LiveStream.js'
import { renderUpcomingEvent } from './components/UpcomingEvent.js'
import { renderNewsList } from './components/NewsList.js'
import { renderGallery } from './components/Gallery.js'
import { renderLatestVideo } from './components/LatestVideo.js'
import { renderPartners } from './components/Partners.js'
import { renderFooter } from './components/Footer.js'

function renderApp() {
  const app = document.getElementById('app')
  if (!app) return

  app.innerHTML = [
    renderHeader(),
    '<main>',
    renderLiveStream(),
    renderUpcomingEvent(),
    renderNewsList(),
    renderGallery(),
    renderLatestVideo(),
    renderPartners(),
    '</main>',
    renderFooter()
  ].join('')

  mountHeader()
}

renderApp()
