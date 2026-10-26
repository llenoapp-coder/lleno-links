// Страница-прослойка для ссылок из писем Lleno (go.llenoapp.com).
// Сама ничего не открывает: вход в приложение создаётся только по нажатию кнопки,
// поэтому превью Telegram, почтовые сканеры и браузер на компьютере ссылку не тратят.
//   /r/?t=<токен>  — сброс пароля → accept-password-reset/<токен>
//   /i/?s=<код>    — приглашение  → accept-invite/<код>
(function () {
  var FUNCTIONS = 'https://enchlbhbhtgtuctaakgz.supabase.co/functions/v1/'

  var KINDS = {
    reset: { param: 't', re: /^[A-Za-z0-9_-]{32}$/, fn: 'accept-password-reset/' },
    invite: { param: 's', re: /^[A-Za-z0-9]{4,16}$/, fn: 'accept-invite/' },
  }

  var TEXT = {
    en: {
      reset: { title: 'Reset your password', lead: 'Tap the button to open Lleno and set a new password.', button: 'Open Lleno' },
      invite: { title: 'You are invited to Lleno', lead: 'Tap the button to open Lleno and accept the invitation.', button: 'Open Lleno' },
      desktop: 'Open this email on the phone where the Lleno app is installed and tap the link there.',
      onPhone: 'I am on my phone',
      bad: 'This link is incomplete. Open it again from the email, or request a new one in the app.',
    },
    ru: {
      reset: { title: 'Сброс пароля', lead: 'Нажмите кнопку — откроется Lleno, там задайте новый пароль.', button: 'Открыть Lleno' },
      invite: { title: 'Приглашение в Lleno', lead: 'Нажмите кнопку — откроется Lleno, там примите приглашение.', button: 'Открыть Lleno' },
      desktop: 'Откройте это письмо на телефоне, где установлено приложение Lleno, и нажмите ссылку там.',
      onPhone: 'Я на телефоне',
      bad: 'Ссылка неполная. Откройте её заново из письма или запросите новую в приложении.',
    },
    es: {
      reset: { title: 'Restablecer contraseña', lead: 'Pulsa el botón para abrir Lleno y crear una nueva contraseña.', button: 'Abrir Lleno' },
      invite: { title: 'Te han invitado a Lleno', lead: 'Pulsa el botón para abrir Lleno y aceptar la invitación.', button: 'Abrir Lleno' },
      desktop: 'Abre este correo en el teléfono donde tienes instalada la app Lleno y pulsa el enlace allí.',
      onPhone: 'Estoy en el teléfono',
      bad: 'El enlace está incompleto. Ábrelo de nuevo desde el correo o solicita uno nuevo en la app.',
    },
  }

  var lang = (navigator.language || 'en').slice(0, 2).toLowerCase()
  var t = TEXT[lang] || TEXT.en
  var kind = KINDS[document.body.getAttribute('data-kind')]
  var $ = function (id) { return document.getElementById(id) }

  var ua = navigator.userAgent
  var isPhone = /iPhone|iPad|iPod|Android/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)

  var value = new URLSearchParams(location.search).get(kind.param) || ''
  var texts = t[document.body.getAttribute('data-kind')]
  document.documentElement.lang = TEXT[lang] ? lang : 'en'
  document.title = texts.title + ' — Lleno'
  $('title').textContent = texts.title

  if (!kind.re.test(value)) {
    $('lead').textContent = t.bad
    return
  }

  var button = $('open')
  button.textContent = texts.button
  button.href = FUNCTIONS + kind.fn + encodeURIComponent(value)

  function showButton() {
    $('lead').textContent = texts.lead
    $('desktop').hidden = true
    button.hidden = false
  }

  if (isPhone) {
    showButton()
  } else {
    $('lead').textContent = t.desktop
    $('desktop').hidden = false
    $('onPhone').textContent = t.onPhone
    $('onPhone').onclick = function (e) { e.preventDefault(); showButton() }
  }
})()
