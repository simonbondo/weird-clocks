function initClock(callback, tickRate = 25, firstDayOfWeekIsMonday = false) {
  if (tickRate < 10) {
    console.error('Tick rate too low')
    return
  }

  const clockState = {
    firstDayOfWeekIsMonday,
    tickNum: 0,
    updateRate: {
      second: 1,
      minute: 2,
      hour: 10,
      day: 40,
      week: 200,
      month: 200,
      year: 200,
      extra: 200
    }
  }
  setInterval(() => tick(clockState, callback), tickRate)
}

function tick(state, callback) {
  if (!state.time) state.time = {}
  if (!state.progress) state.progress = {}

  state.time.now = new Date()
  if (!state.time.daysInMonth) {
    state.time.daysInMonth = getDaysInMonth(state.time.now.getFullYear(), state.time.now.getMonth())
  }

  if (state.tickNum % state.updateRate.second === 0) {
    state.time.milliseconds = state.time.now.getMilliseconds()
    state.progress.second = state.time.milliseconds / 1000
  }
  if (state.tickNum % state.updateRate.minute === 0) {
    state.time.seconds = state.time.now.getSeconds()
    state.progress.minute = state.time.seconds / 60 + state.progress.second / 60
  }
  if (state.tickNum % state.updateRate.hour === 0) {
    const minutes = state.time.now.getMinutes()
    if (state.time.minutes !== minutes) {
      state.time.minutes = minutes
      // Reset the tick counter every time the minutes value changes.
      // This ensures that slower update rates (like day, week, etc.) are updated correctly.
      state.tickNum = 0
    }
    state.progress.hour = state.time.minutes / 60 + state.progress.minute / 60
  }
  if (state.tickNum % state.updateRate.day === 0) {
    state.time.hours = state.time.now.getHours()
    state.progress.day = state.time.hours / 24 + state.progress.hour / 24
  }
  if (state.tickNum % state.updateRate.week === 0) {
    state.time.day = state.time.now.getDay()
    if (state.firstDayOfWeekIsMonday) {
      state.time.day = (state.time.day + 6) % 7
    }
    state.progress.week = state.time.day / 7 + state.progress.day / 7
  }
  if (state.tickNum % state.updateRate.month === 0) {
    state.time.date = state.time.now.getDate()
    state.progress.month = state.time.date / state.time.daysInMonth + state.progress.day / state.time.daysInMonth
  }
  if (state.tickNum % state.updateRate.year === 0) {
    state.time.month = state.time.now.getMonth()
    state.progress.year = state.time.month / 12 + state.progress.month / 12
  }
  if (state.tickNum % state.updateRate.extra === 0) {
    state.time.year = state.time.now.getFullYear()
    state.time.daysInMonth = getDaysInMonth(state.time.year, state.time.month)
    state.progress.decade = state.time.year % 10 / 10 + state.progress.year / 10
    state.progress.century = state.time.year % 100 / 100 + state.progress.year / 100
    state.progress.millennia = state.time.year % 1000 / 1000 + state.progress.year / 1000
  }

  callback(state.time, state.progress)

  if (++state.tickNum % 1000000 === 0)
    state.tickNum = 0
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
