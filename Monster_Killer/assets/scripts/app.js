const CHOSEN_MAX_LIFE = (Math.random() * (1001 - 500) + 500).toFixed(0)
const HERO_STANDART_ATTACK_VALUE = CHOSEN_MAX_LIFE * 0.1
const HERO_STRONG_ATTACK_VALUE = HERO_STANDART_ATTACK_VALUE * 1.8
const MONSTER_ATTACK_VALUE = CHOSEN_MAX_LIFE * 0.15
const HEAL_COUNT_VALUE = 3
const HEAL_VALUE = (CHOSEN_MAX_LIFE * 0.2).toFixed(0)
const ATTACK_STANDART = 'Standart'
const ATTACK_STRONG = 'Strong'

let currentMonsterLife = CHOSEN_MAX_LIFE
let currentHeroLife = CHOSEN_MAX_LIFE
let hasBonusLife = true

adjustHealthBars(CHOSEN_MAX_LIFE)
setHeroName()

function attack(attackType) {
  let heroAttack =
    attackType === ATTACK_STANDART
      ? HERO_STANDART_ATTACK_VALUE
      : attackType === ATTACK_STRONG
      ? HERO_STRONG_ATTACK_VALUE
      : false

  if (currentMonsterLife > 0 && currentHeroLife > 0) {
    const dealtHeroDamage = dealMonsterDamage(heroAttack)
    currentMonsterLife -= dealtHeroDamage
    writeToLog(`${heroNameEl.innerText} deals ${dealtHeroDamage} damage to Monster`)
    if (currentMonsterLife <= 0) {
      Swal.fire({
        title: 'You won!',
        text: `Congratulations, ${heroNameEl.innerText}!`,
        icon: 'success',
        confirmButtonText: 'Yay',
      })
      writeToLog(`${heroNameEl.innerText} has slayed Monster!`)
      return
    }

    const dealtMonsterDamage = dealHeroDamage(MONSTER_ATTACK_VALUE)
    currentHeroLife -= dealtMonsterDamage
    writeToLog(`Monster deals ${dealtMonsterDamage} damage to ${heroNameEl.innerText}`)
    if (currentHeroLife <= 0 && hasBonusLife) {
      hasBonusLife = false
      removeBonusLife()
      setHeroHealth(1)
      writeToLog('Bonus life has been used!')
      currentHeroLife = heroHealthBar.value
      Swal.fire({
        title: 'You are almost beaten...',
        text: 'But your will to live is strong.. you have one more chance!',
        icon: 'warning',
      })
      return
    } else if (currentHeroLife <= 0) {
      Swal.fire({
        title: 'You are dead!',
        text: 'Maybe next time you will win',
        icon: 'error',
        confirmButtonText: 'Yikes',
      })
      writeToLog(`Monster has slayed ${heroNameEl.innerText}!`)
      return
    }
  }
}

function onStandartAttack() {
  attack(ATTACK_STANDART)
}

function onStrongAttack() {
  attack(ATTACK_STRONG)
}

function onHeal() {
  if (currentMonsterLife > 0 && currentHeroLife > 0) {
    if (+healCountEl.innerText <= 0) {
      Swal.fire({
        title: `You don't have any heals left!`,
        icon: 'info',
      })
      return
    }
    if (heroHealthBar.value >= CHOSEN_MAX_LIFE) {
      Swal.fire({
        title: `You're healthier than a gym with a 24/7 open buffet!`,
        text: 'Do you really want to heal?',
        icon: 'question',
        focusDeny: true,
        showDenyButton: true,
        denyButtonText: 'Nah',
        confirmButtonText: 'Sure!',
      }).then((choise) => {
        if (choise.value) {
          increaseHeroHealth(+HEAL_VALUE)
          healCountEl.innerText -= 1
          writeToLog(`${heroNameEl.innerText} restored ${HEAL_VALUE} health!`)
        }
      })
    } else
      Swal.fire({
        title: 'Use heal?',
        icon: 'question',
        showDenyButton: true,
        denyButtonText: 'No',
        confirmButtonText: 'Yes',
      }).then((choise) => {
        if (choise.value) {
          increaseHeroHealth(+HEAL_VALUE)
          healCountEl.innerText -= 1
          writeToLog(`${heroNameEl.innerText} restored ${HEAL_VALUE} health!`)
        }
      })
  }
}

function onStartOver() {
  Swal.fire({
    title: 'Do you want to start over?',
    icon: 'question',
    showDenyButton: true,
    focusDeny: true,
    denyButtonText: 'Nope',
    confirmButtonText: 'Yep',
  }).then((choise) => {
    choise.value ? resetValues() : null
  })
}

function writeToLog(event) {
  const logEntryEl = document.createElement('p')
  const logDateSpan = document.createElement('span')
  const logTextSpan = document.createElement('span')

  logEntryEl.className = 'log-entry'
  logDateSpan.className = 'log-date'
  logTextSpan.className = 'log-text'

  logDateSpan.textContent = '[' + new Date().toLocaleTimeString() + ']'
  logTextSpan.textContent = ' ' + event

  logEntryEl.appendChild(logDateSpan)
  logEntryEl.appendChild(logTextSpan)

  logEntriesSection.appendChild(logEntryEl)
  logEntriesSection.scrollTop = logEntriesSection.scrollHeight
}

function onToggleLogVisibility() {
  if (battleLogSection.style.display !== 'none') {
    battleLogSection.style.display = 'none'
    hideLogBtn.textContent = 'SHOW GAME LOG'
  } else {
    battleLogSection.style.display = 'block'
    logEntriesSection.scrollTop = logEntriesSection.scrollHeight
    hideLogBtn.textContent = 'HIDE GAME LOG'
  }
}

attackBtn.addEventListener('click', onStandartAttack)
strongAttackBtn.addEventListener('click', onStrongAttack)
healBtn.addEventListener('click', onHeal)
startOverBtn.addEventListener('click', onStartOver)
hideLogBtn.addEventListener('click', onToggleLogVisibility)
