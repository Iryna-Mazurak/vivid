// Seamless infinite marquee — duplicates content and wraps via offsetLeft of first clone
function initSeamlessMarquee(selector, baseDuration, mobileFactor) {
  const track = document.querySelector(selector)
  if (!track) return

  track.innerHTML += track.innerHTML

  const items = track.children
  const halfCount = items.length / 2
  // Distance from start of original to start of first clone = real cycle length (includes gap)
  const cycle = items[halfCount].offsetLeft
  if (!cycle) return

  const isMobile = $(window).width() <= 479
  const duration =
    isMobile && mobileFactor ? baseDuration / mobileFactor : baseDuration

  gsap.to(track, {
    x: -cycle,
    duration,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x) => parseFloat(x) % cycle),
    },
  })
}

initSeamlessMarquee('.marquee__logos', 20, 2.5)
initSeamlessMarquee('.intro-furniture__labels', 30)

// Burger menu toggle
$('.btn-burger').on('click', function () {
  $(this).toggleClass('is-active')
  $('body').toggleClass('menu-open')
  $('.menu-mobile--main').toggleClass('is-active')
})

// Slick slider for mobile
if ($(window).width() <= 491) {
  $('.mobile-slider').slick({
    dots: true,
    arrows: false,
    slidesToShow: 1,
  })
}

if ($(window).width() > 491) {
  $('.desktop-slider').slick({
    dots: false,
    arrows: true,
    prevArrow: $('.head__controls .btn-prev'),
    nextArrow: $('.head__controls .btn-next'),
    slidesToShow: 3,
    infinite: false,
    draggable: false,
    swipe: false,
    touchMove: false,
  })
} else {
  $('.desktop-slider').slick({
    dots: true,
    arrows: false,
    slidesToShow: 1,
    infinite: false,
    draggable: false,
    swipe: false,
    touchMove: false,
  })
}

$('.before-after').beforeAfter({
  movable: true,
  clickMove: true,
  position: 50,
  opacity: 0.4,
  activeOpacity: 1,
  hoverOpacity: 0.8,
  separatorColor: '#37CC8F',
  bulletColor: '#37CC8F',
  arrowColor: '#333333',
  onMoveStart: function () {
    $(this).closest('.before-after-container').addClass('is-interacted')
  },
  onMoving: function () {},
  onMoveEnd: function () {},
})

document.querySelectorAll('.before-after-container').forEach((container) => {
  const $container = $(container)
  let interacted = false

  $container.on('mousedown.ba touchstart.ba', () => {
    interacted = true
  })

  function nudge() {
    if (interacted) return
    $container.addClass('is-nudging')

    const startPos = 50
    const offset = 5
    const steps = [
      { pos: startPos - offset, dur: 450 },
      { pos: startPos + offset, dur: 450 },
      { pos: startPos - offset, dur: 450 },
      { pos: startPos + offset, dur: 450 },
      { pos: startPos, dur: 300 },
    ]

    let i = 0
    function next() {
      if (interacted || i >= steps.length) {
        $container.beforeAfter('set', 'position', startPos)
        $container.removeClass('is-nudging')
        return
      }
      const { pos, dur } = steps[i++]
      $(container).find('.after-wrapper').animate({ width: pos + '%' }, dur)
      $(container).find('.separator').animate({ right: pos + '%' }, dur, next)
    }
    next()
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect()
        setTimeout(nudge, 500)
      }
    },
    { threshold: 0.5 },
  )
  observer.observe(container)
})

// Header menu hover

if ($(window).width() > 481) {
  let menuTimeout

  $('.header-nav__item--menu-1, .menu-mobile--main').hover(
    function () {
      clearTimeout(menuTimeout)
      $('.menu-mobile--main').addClass('is-active')
      $('html').addClass('menu-active')
    },
    function () {
      menuTimeout = setTimeout(function () {
        $('.menu-mobile--main').removeClass('is-active')
        $('html').removeClass('menu-active')
      }, 300)
    },
  )
}

if ($(window).width() > 481) {
  let menuTimeoutIndustries

  $('.header-nav__item--menu-industries, .menu-mobile--industries').hover(
    function () {
      clearTimeout(menuTimeoutIndustries)
      $('.menu-mobile--industries').addClass('is-active')
      $('html').addClass('menu-active')
    },
    function () {
      menuTimeoutIndustries = setTimeout(function () {
        $('.menu-mobile--industries').removeClass('is-active')
        $('html').removeClass('menu-active')
      }, 300)
    },
  )
}

// Styler for selects
$('select').styler()

// Form
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const personalEmailDomains = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'ymail.com',
  'rocketmail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'proton.me',
  'protonmail.com',
  'pm.me',
  'zoho.com',
  'mail.com',
  'gmx.com',
  'gmx.net',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  'inbox.ru',
  'bk.ru',
  'list.ru',
])

function isBusinessEmail(email) {
  const domain = email.split('@').pop()?.toLowerCase()

  return Boolean(domain) && !personalEmailDomains.has(domain)
}

function getFormRedirectBlankUrl($form) {
  return $form.attr('data-form-redirect-blank')?.trim() || ''
}

function reserveFormRedirectBlank($form) {
  const redirectUrl = getFormRedirectBlankUrl($form)
  if (!redirectUrl) return null

  const redirectWindow = window.open('about:blank', '_blank')
  if (redirectWindow) redirectWindow.opener = null

  return { redirectUrl, redirectWindow }
}

function openFormRedirectBlank(redirect) {
  if (!redirect) return

  const { redirectUrl, redirectWindow } = redirect
  if (redirectWindow && !redirectWindow.closed) {
    redirectWindow.location.href = redirectUrl
    return
  }

  window.open(redirectUrl, '_blank', 'noopener,noreferrer')
}

function closeFormRedirectBlank(redirect) {
  if (redirect?.redirectWindow && !redirect.redirectWindow.closed) {
    redirect.redirectWindow.close()
  }
}

function showError($field, message) {
  const $inpGroup = $field.closest('.inp-group')
  $field.addClass('inp-error')
  $inpGroup.find('.inp-group__error').remove()
  $inpGroup.append(`<div class="inp-group__error">${message}</div>`)
}

function clearError($field) {
  const $inpGroup = $field.closest('.inp-group')
  $field.removeClass('inp-error')
  $inpGroup.find('.inp-group__error').remove()
}

$(document).on(
  'input',
  '.modal .inp-group__input, .modal .inp-group__textarea',
  function () {
    clearError($(this))
  },
)

$(document).on('change', '.modal .inp-group__select', function () {
  clearError($(this))
})

$(document).on('submit', '.modal .form', function (e) {
  e.preventDefault()
  return false
})

function validateForm($scope) {
  let isValid = true
  let $firstError = null

  $scope.find('[required]').each(function () {
    const $field = $(this)
    const value = $field.val()?.trim()

    if (!value || value === 'Please Select') {
      isValid = false
      showError($field, 'This field is required')
      if (!$firstError) $firstError = $field
    }
  })

  const $emailField = $scope.find('[name="email"]')
  const emailValue = $emailField.val()?.trim()

  if (emailValue && !isValidEmail(emailValue)) {
    isValid = false
    showError($emailField, 'Please enter a valid email')
    if (!$firstError) $firstError = $emailField
  }

  if (
    emailValue &&
    isValidEmail(emailValue) &&
    $emailField.hasClass('js-business-email') &&
    !isBusinessEmail(emailValue)
  ) {
    isValid = false
    showError($emailField, 'Please enter your business email')
    if (!$firstError) $firstError = $emailField
  }

  const $phoneField = $scope.find('[name="phone-number"]')
  if ($phoneField.length && $phoneField.val()?.trim()) {
    var iti = $phoneField[0]._iti
    if (iti && !iti.isValidNumber()) {
      isValid = false
      showError($phoneField, 'Invalid phone number')
      if (!$firstError) $firstError = $phoneField
    }
  }

  if (!isValid) {
    $firstError.focus()

    setTimeout(() => {
      $scope.find('.inp-error').removeClass('inp-error')
      $scope.find('.inp-group__error').remove()
    }, 10000)
  }

  return isValid
}

function goToStep($form, stepNumber) {
  $form.find('.form-step').removeClass('is-active')
  const $target = $form.find('.form-step').eq(stepNumber - 1)
  $target.addClass('is-active')
  initPhoneInput($target[0])
  initCountrySelect($target[0])

  const $modal = $form.closest('.modal')
  $modal.find('.form-modal-cases__headline').removeClass('is-active')
  $modal
    .find('.form-modal-cases__headline--' + stepNumber)
    .addClass('is-active')
}

$(document).on('click', '.js-form-validate', function (e) {
  e.preventDefault()
  const $step = $(this).closest('.form-step')
  if (!validateForm($step)) return

  const $phoneField = $step.find('input[name="phone-number"]')
  if ($phoneField.length) {
    const $iti = $phoneField.closest('.iti')
    const dialCode = $iti.find('.iti__selected-dial-code').text() || ''
    const phoneValue = dialCode + $phoneField.val()?.trim()
  }

  const targetStep = $(this).data('show-step')
  if (targetStep) {
    goToStep($(this).closest('.form'), targetStep)
  }
})

$(document).on('click', '.btn-back', function (e) {
  e.preventDefault()
  const targetStep = $(this).data('show-step')
  if (targetStep) {
    goToStep($(this).closest('.form'), targetStep)
  }
})

$(document).on('click', '.js-form-submit', async function (e) {
  // Skip — PDF form has its own handler below
  if ($(this).closest('.form--pdf').length) return

  e.preventDefault()

  const $modal = $(this).closest('.modal')
  const $form = $modal.find('.form')
  const $submitBtn = $(this)

  if (!validateForm($form)) return
  const redirect = reserveFormRedirectBlank($form)

  const formData = new URLSearchParams()
  formData.append('name', $form.attr('data-form-name') || 'Email Form')
  formData.append('test', 'false')
  formData.append('dolphin', 'false')

  const turnstileResponse = formData.get('cf-turnstile-response')
  if (turnstileResponse) {
    formData.append('fields[cf-turnstile-response]', turnstileResponse)
  }

  $form.find('input[name], select[name], textarea[name]').each(function () {
    const name = $(this).attr('name')
    if (name === 'phone-number') return
    const value = $(this).val()?.trim() || ''
    if (!value || value === 'Please Select') return
    formData.append(`fields[${name}]`, value)
  })

  const $phoneField = $form.find('input[name="phone-number"]')
  if ($phoneField.length) {
    const $iti = $phoneField.closest('.iti')
    const dialCode = $iti.find('.iti__selected-dial-code').text() || ''
    const phoneValue = dialCode + $phoneField.val()?.trim()
    formData.append('fields[phone-number]', phoneValue)
  }

  try {
    $submitBtn.prop('disabled', true).text('Sending...')

    const response = await fetch(
      'https://webflow.com/api/v1/form/6952b9bebcaee026f26ba657',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    )

    if (response.ok) {
      $form[0].reset()
      $form.find('.inp-group__select').trigger('refresh')

      if ($form.find('.form-step').length) {
        goToStep($form, 1)
      }

      // Show success block (replaced by /thank-you redirect)
      // $modal.find('.modal-success').addClass('is-active')
      // $form.find('.form__row:nth-child(1)').hide()
      openFormRedirectBlank(redirect)

      // setTimeout(() => {
      //   $modal.find('.modal-success').removeClass('is-active')
      //   $form.find('.form__row:nth-child(1)').show()
      // }, 15000)

      window.location.href = '/thank-you'
      return
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    closeFormRedirectBlank(redirect)
    console.error('Form submission error:', error)
  } finally {
    $submitBtn.prop('disabled', false).text('Get Started')
  }
})

// PDF form (.form--pdf) — separate submit handler
$(document).on('input', '.form--pdf .inp-group__input', function () {
  clearError($(this))
})

$(document).on('click', '.form--pdf .js-form-submit', async function (e) {
  e.preventDefault()

  const $form = $(this).closest('.form--pdf')
  const $submitBtn = $(this)
  const originalText = $submitBtn.text()

  if (!validateForm($form)) return
  const pdfUrl = getFormRedirectBlankUrl($form)

  const formData = new URLSearchParams()
  formData.append('name', $form.attr('data-form-name') || 'PDF Form')
  formData.append('test', 'false')
  formData.append('dolphin', 'false')

  $form.find('input[name], select[name], textarea[name]').each(function () {
    const name = $(this).attr('name')
    const value = $(this).val()?.trim() || ''
    if (!value) return
    formData.append(`fields[${name}]`, value)
  })

  try {
    $submitBtn.prop('disabled', true).text('Sending...')

    const response = await fetch(
      'https://webflow.com/api/v1/form/6952b9bebcaee026f26ba657',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      },
    )

    if (response.ok) {
      $form[0].reset()

      // Show success block + open PDF in a new tab (replaced by /thank-you-pdf redirect)
      // const $wrap = $form.closest('.form-retail-form__form')
      // let $success = $wrap.find('.form-retail-form__success')
      // if (!$success.length) {
      //   $success = $(`
      //     <div class="form-retail-form__success">
      //       <div class="modal-success__head">
      //         <img loading="lazy" src="https://cdn.prod.website-files.com/6952b9bebcaee026f26ba657/695d02a36232b083616d3648_checkmark.png" alt="" class="modal-success__illustration">
      //         <div class="form-modal-visual__text mobile-fw">
      //           <div class="form-modal-visual__title">You're all set!</div>
      //           <div class="form-modal-visual__description">Your executive playbook is ready. <br>You’ll be redirected to the PDF in a moment.</div>
      //         </div>
      //       </div>
      //     </div>
      //   `)
      //   $wrap.append($success)
      // }
      // $form.hide()
      // $success.show()
      // openFormRedirectBlank(redirect)

      // setTimeout(() => {
      //   $form.show()
      //   $success.hide()
      // }, 15000)

      window.location.href = pdfUrl || '/thank-you-pdf'
      return
    } else {
      throw new Error('Submission failed')
    }
  } catch (error) {
    console.error('PDF form submission error:', error)
  } finally {
    $submitBtn.prop('disabled', false).text(originalText)
  }
})

$('.modal__close').on('click', function () {
  $('.modal').removeClass('is-active')
  $('html').removeClass('is-ovh')
})

$(document).on('click', '[data-modal-close]', function () {
  $(this).closest('.modal').removeClass('is-active')
  $('html').removeClass('is-ovh')
})

$('[data-modal-open]').on('click', function () {
  const modalId = $(this).attr('data-modal-open') || 'modal-form-main'
  const $modal = $('#' + modalId)
  if (!$modal.length) return

  $modal.addClass('is-active')
  $('html').addClass('is-ovh')

  // Init plugins on the currently visible step
  const $activeStep = $modal.find('.form-step.is-active')
  if ($activeStep.length) {
    initPhoneInput($activeStep[0])
    initCountrySelect($activeStep[0])
  } else {
    initPhoneInput($modal[0])
    initCountrySelect($modal[0])
  }
})

$('.modal').on('click', function (e) {
  if (!$(e.target).closest('.modal__in').length) {
    $('.modal').removeClass('is-active')
    $('html').removeClass('is-ovh')
  }
})

// GSAP slide + fade
$('[data-image-change]').each(function () {
  const $img = $(this)
  const images = $img
    .data('image-change')
    .split(',')
    .map((s) => s.trim())
  let currentIndex = 0

  setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length

    gsap.to($img, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        $img.attr('src', images[currentIndex])
        gsap.to($img, {
          opacity: 1,
          duration: 0.3,
          clearProps: 'all',
        })
      },
    })
  }, 3000)
})

$('.iframe-box iframe').each(function () {
  const $container = $(this).closest('.iframe-box')
  const containerWidth = $container.width()
  const containerHeight = $container.height()

  const originalWidth = 1920
  const originalHeight = 1080

  const scaleX = containerWidth / originalWidth
  const scaleY = containerHeight / originalHeight
  const scale = Math.max(scaleX, scaleY)

  // const scale = Math.min(scaleX, scaleY)

  $(this).css({
    width: originalWidth + 'px',
    height: originalHeight + 'px',
    transform: `scale(${scale})`,
    'transform-origin': 'top left',
  })
})

// Case Studies & Filters
;(function () {
  if (!window.caseStudies || !window.caseStudies.length) return

  const DEFAULT_ICON =
    'https://cdn.prod.website-files.com/6952b9bebcaee026f26ba657/69a0584ed9550904a35d0264_category-2.svg'
  const CLOSE_ICON =
    'https://cdn.prod.website-files.com/6952b9bebcaee026f26ba657/69a0584ef3f40602bcac1680_close.svg'

  // Scrape categories from DOM before clearing
  const $existingItems = $('.case-studies__items .case-studies-item')
  $existingItems.each(function (i) {
    if (!window.caseStudies[i]) return
    const cats = []
    $(this)
      .find('.case-studies-item-categories')
      .first()
      .children('.case-studies-item-category')
      .each(function () {
        cats.push({
          name: $(this).find('.case-studies-item-category__text').text().trim(),
          icon:
            $(this).find('.case-studies-item-category__icon').attr('src') || '',
        })
      })
    window.caseStudies[i].categories = cats
  })

  // Build category icon map from scraped data
  const categoryIconMap = {}
  window.caseStudies.forEach((item) => {
    ;(item.categories || []).forEach((cat) => {
      if (cat.name && cat.icon && !categoryIconMap[cat.name]) {
        categoryIconMap[cat.name] = cat.icon
      }
    })
  })

  function getCategoryIcon(category) {
    return categoryIconMap[category] || DEFAULT_ICON
  }

  // Get unique categories
  const categories = [
    ...new Set(
      window.caseStudies.flatMap((item) =>
        (item.categories || []).map((c) => c.name).filter(Boolean),
      ),
    ),
  ]

  // Render filters
  const $choosen = $('.filter__choosen')
  const $row = $('.filter__row')

  // Clean up Webflow CMS wrappers and old filter-items
  $choosen.find('.w-dyn-list').remove()
  $row.find('.w-dyn-list').remove()
  $choosen.find('.filter-item').remove()
  $row.find('.filter-item').remove()

  categories.forEach((cat) => {
    const icon = getCategoryIcon(cat)

    $choosen.append(`
      <div class="filter-item" data-category="${cat}">
        <img src="${icon}" alt="" class="filter-item__icon">
        <div class="filter-item__text">${cat}</div>
        <img src="${CLOSE_ICON}" alt="" class="filter-item__icon filter-item__icon--close">
      </div>
    `)

    $row.append(`
      <div class="filter-item" data-category="${cat}">
        <img src="${icon}" alt="" class="filter-item__icon">
        <div class="filter-item__text">${cat}</div>
      </div>
    `)
  })

  // Render case studies
  const $list = $('.case-studies__items')
  $list.empty()

  window.caseStudies.forEach((item) => {
    const itemCats = item.categories || []
    const catNames = itemCats.map((c) => c.name).filter(Boolean)

    const categoriesHtml = itemCats
      .map(
        (cat) => `
        <div class="case-studies-item-category">
          <img src="${cat.icon || getCategoryIcon(cat.name)}" alt="" class="case-studies-item-category__icon">
          <div class="case-studies-item-category__text">${cat.name}</div>
        </div>`,
      )
      .join('')

    const labels = [item.label1, item.label2, item.label3].filter(Boolean)
    const labelsHtml = labels
      .map((l) => `<div class="case-studies-item-titles__value">${l}</div>`)
      .join('')

    $list.append(`
      <div role="listitem" class="case-studies-item w-dyn-item" data-categories='${JSON.stringify(catNames)}'>
        <div class="case-studies-item__content">
          <div class="case-studies-item__head">
            <div class="case-studies-item-categories mobile-hidden">
              ${categoriesHtml}
            </div>
            <div class="case-studies-item-titles">
              ${labelsHtml}
            </div>
          </div>
          <div class="case-studies-item__body">
            <div class="case-studies-item__text">
              <div class="h6 mobile-font-size-20">${item.title || ''}</div>
              <div class="case-studies-item__subtitle">${item.description || ''}</div>
            </div>
            <div class="case-studies-item__footer">
              ${item.logo ? `<img src="${item.logo}" alt="" class="case-studies-item__logo">` : ''}
              ${item.link ? `<a href="${item.link}" class="case-studies-item__link">Web viewer</a>` : ''}
            </div>
          </div>
        </div>
        <div class="case-studies-item__visual">
          ${item.illustration ? `<img src="${item.illustration}" alt="" class="case-studies-item__illustration">` : ''}
          <div class="case-studies-item__label">
            <div class="case-studies-item-categories mobile-visible">
              ${categoriesHtml}
            </div>
          </div>
        </div>
      </div>
    `)
  })

  $list.removeClass('is-hidden')

  // Clear filters button
  const $clearBtn = $(`
    <div class="filter-item filter-item--clear">
      <img src="${CLOSE_ICON}" alt="" class="filter-item__icon filter-item__icon--close">
      <div class="filter-item__text">Clear filters</div>
    </div>
  `)
  $row.append($clearBtn)
  $clearBtn.hide()

  // Active filters tracking
  let activeFilters = []

  function filterItems() {
    if (activeFilters.length === 0) {
      $('.case-studies-item').show()
      $clearBtn.hide()
    } else {
      $('.case-studies-item').each(function () {
        const cats = $(this).data('categories') || []
        const hasMatch = cats.some((c) => activeFilters.includes(c))
        $(this).toggle(hasMatch)
      })

      if (activeFilters.length === categories.length) {
        $clearBtn.show()
      } else {
        $clearBtn.hide()
      }
    }
  }

  // Filter button toggle
  $('.btn-filter').on('click', function (e) {
    e.stopPropagation()
    $(this).toggleClass('is-active')
    $('.filter__row').toggleClass('is-active')
    $('.filter').toggleClass('is-opened')
  })

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.filter').length) {
      $('.btn-filter').removeClass('is-active')
      $('.filter__row').removeClass('is-active')
      $('.filter').removeClass('is-opened')
    }
  })

  // Click on filter in dropdown
  $row.on('click', '.filter-item:not(.filter-item--clear)', function () {
    const cat = $(this).data('category')
    $(this).toggleClass('is-hidden')
    $choosen
      .find(`.filter-item[data-category="${cat}"]`)
      .toggleClass('is-active')

    if (activeFilters.includes(cat)) {
      activeFilters = activeFilters.filter((c) => c !== cat)
    } else {
      activeFilters.push(cat)
    }
    filterItems()
  })

  // Click on filter in choosen bar
  $choosen.on('click', '.filter-item', function () {
    const cat = $(this).data('category')
    $(this).removeClass('is-active')
    $row.find(`.filter-item[data-category="${cat}"]`).removeClass('is-hidden')

    activeFilters = activeFilters.filter((c) => c !== cat)
    filterItems()
  })

  // Clear all filters
  $clearBtn.on('click', function () {
    activeFilters = []
    $choosen.find('.filter-item').removeClass('is-active')
    $row.find('.filter-item').removeClass('is-hidden')
    filterItems()
  })
})()

// Accordion
$('.faq-item').on('click', function () {
  const $item = $(this)

  $item
    .siblings('.faq-item')
    .removeClass('is-active')
    .find('.faq-item__body')
    .slideUp()
  $item.toggleClass('is-active').find('.faq-item__body').slideToggle()
})

// Init phone intl-tel-input on a visible element
function initPhoneInput(container) {
  if (!container) return
  var phoneInput = container.querySelector('[name="phone-number"]')
  if (!phoneInput || !window.intlTelInput) return
  if (phoneInput.dataset.itiInit) return
  phoneInput.dataset.itiInit = 'true'

  var iti = intlTelInput(phoneInput, {
    initialCountry: 'us',
    separateDialCode: true,
    dropdownContainer: document.body,
    loadUtils: function () {
      return import('https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/utils.js')
    },
  })

  // Store instance on the element for validation
  phoneInput._iti = iti
}

// Init countrySelect on a visible element
function initCountrySelect(container) {
  $(container)
    .find('[name="country"]')
    .each(function () {
      if (!$(this).data('countrySelect')) {
        $(this).countrySelect({
          responsiveDropdown: true,
        })
      }
    })
}

// Init all phone inputs on page load
document.querySelectorAll('[name="phone-number"]').forEach(function (el) {
  initPhoneInput(
    el.closest('.form-step') || el.closest('.form') || el.parentElement,
  )
})

// Phone input mask - only digits, spaces, dashes, parens, plus
$(document).on('input', '[name="phone-number"]', function () {
  var cleaned = $(this)
    .val()
    .replace(/[^\d\s\-()+ ]/g, '')
  if (cleaned !== $(this).val()) {
    $(this).val(cleaned)
  }
})

const video = document.querySelector('.cta__visual video')
const block = document.querySelector('.cta__in')

if (video && block) {
  video.setAttribute('crossorigin', 'anonymous')

  function extractColor() {
    try {
      const c = document.createElement('canvas')
      c.width = video.videoWidth
      c.height = video.videoHeight
      const ctx = c.getContext('2d')
      ctx.drawImage(video, 0, 0, c.width, c.height)

      const [r, g, b] = ctx.getImageData(c.width - 5, 5, 1, 1).data

      if (r === 0 && g === 0 && b === 0) return false

      block.style.backgroundColor = `rgb(${r},${g},${b})`
      console.log(`Color: rgb(${r},${g},${b})`)
      return true
    } catch (e) {
      console.warn('Canvas error:', e)
      return false
    }
  }

  // чекаємо поки відео реально програє ~0.5 секунди
  video.addEventListener('timeupdate', function handler() {
    if (video.currentTime >= 0.5 && extractColor()) {
      video.removeEventListener('timeupdate', handler)
    }
  })

  $('.cta__buttons .btn-black.bordered-fw').on('click', function () {
    $('.woot--hide + .woot--bubble-holder').trigger('click')
  })
}

// Spotlight
const advantagesWrappers = document.querySelectorAll('.advantages-item-wrapper')
if (advantagesWrappers.length) {
  advantagesWrappers.forEach((wrapper) => {
    const color = wrapper.getAttribute('data-color-variable')
    const card = wrapper.querySelector('.advantages-item')

    card.style.setProperty('--c', color)

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', e.clientX - r.left + 'px')
      card.style.setProperty('--mouse-y', e.clientY - r.top + 'px')
    })
  })
}

// Numbers spotlight
const numbersCards = document.querySelectorAll('.numbers-item[data-color-variable]')
if (numbersCards.length) {
  numbersCards.forEach((card) => {
    const color = card.getAttribute('data-color-variable')
    card.style.setProperty('--c', color)

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mouse-x', e.clientX - r.left + 'px')
      card.style.setProperty('--mouse-y', e.clientY - r.top + 'px')
    })
  })
}

// Numbers
const numberItems = document.querySelectorAll('.numbers-item__title')
if (numberItems.length) {
  gsap.registerPlugin(ScrollTrigger)

  const configs = [
    { duration: 2.0, ease: 'power1.out', delay: 0 },
    { duration: 2.5, ease: 'power2.out', delay: 0.2 },
    { duration: 1.8, ease: 'power3.out', delay: 0.1 },
  ]

  // Parse "$849B", "1,200+", "99%", "849" → { prefix, number, suffix, hasComma, decimals }
  function parseNumberText(text) {
    const match = text.trim().match(/^(\D*)([\d.,]+)(.*)$/)
    if (!match) return null

    const [, prefix, numStr, suffix] = match
    const hasComma = numStr.includes(',')
    const cleaned = numStr.replace(/,/g, '')
    const number = parseFloat(cleaned)
    if (Number.isNaN(number)) return null

    const dotIdx = cleaned.indexOf('.')
    const decimals = dotIdx === -1 ? 0 : cleaned.length - dotIdx - 1

    return { prefix, number, suffix, hasComma, decimals }
  }

  function formatNumber(value, parsed) {
    const fixed = value.toFixed(parsed.decimals)
    const formatted = parsed.hasComma
      ? Number(fixed).toLocaleString('en-US', {
          minimumFractionDigits: parsed.decimals,
          maximumFractionDigits: parsed.decimals,
        })
      : fixed
    return parsed.prefix + formatted + parsed.suffix
  }

  numberItems.forEach((el, i) => {
    const parsed = parseNumberText(el.textContent)
    if (!parsed) return

    const { duration, ease, delay } = configs[i] ?? configs[0]
    const proxy = { val: 0 }

    // Set initial display state
    el.textContent = formatNumber(0, parsed)

    gsap.to(proxy, {
      val: parsed.number,
      duration,
      ease,
      delay,
      onUpdate: () => {
        el.textContent = formatNumber(proxy.val, parsed)
      },
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        once: true,
      },
    })
  })
}

const digitalAssetItems = document.querySelectorAll('.digital-asset-item')

if (digitalAssetItems.length) {
  gsap.registerPlugin(ScrollTrigger)

  digitalAssetItems.forEach((item) => {
    const isReverse = item.classList.contains('is-reverse')
    const content = item.querySelector('.digital-asset-item__content')
    const visual = item.querySelector('.digital-asset-item__visual')

    gsap.fromTo(
      content,
      { x: isReverse ? 60 : -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          once: true,
        },
      },
    )

    gsap.fromTo(
      visual,
      { x: isReverse ? -60 : 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power2.out',
        delay: 0.1,
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          once: true,
        },
      },
    )
  })
}

// ReactBits-style 3D Carousel with infinite loop
const upgradeSection = document.querySelector('.upgrade-visual__items')

if (upgradeSection) {
  const track = upgradeSection.querySelector('.upgrade-visual-items')
  const originalItems = Array.from(track.querySelectorAll('.upgrade-visual-item'))
  const dots = Array.from(
    upgradeSection.querySelectorAll('.upgrade-visual-dots__item'),
  )
  const realCount = originalItems.length

  // Clone last → prepend, clone first → append (for seamless loop)
  const cloneLast = originalItems[realCount - 1].cloneNode(true)
  const cloneFirst = originalItems[0].cloneNode(true)
  cloneLast.setAttribute('aria-hidden', 'true')
  cloneFirst.setAttribute('aria-hidden', 'true')
  track.insertBefore(cloneLast, originalItems[0])
  track.appendChild(cloneFirst)

  // All items including clones
  const allItems = Array.from(track.querySelectorAll('.upgrade-visual-item'))

  const GAP = 16
  // position 0 = clone of last, 1..realCount = real items, realCount+1 = clone of first
  let position = 1
  let isAnimating = false
  let startX = 0
  let isDragging = false
  let dragDeltaX = 0

  function getItemWidth() {
    return allItems[0].offsetWidth
  }

  function getTrackItemOffset() {
    return getItemWidth() + GAP
  }

  // Real index for dots (0-based)
  function getRealIndex() {
    return ((position - 1) % realCount + realCount) % realCount
  }

  function render(animated) {
    const itemWidth = getItemWidth()
    const trackItemOffset = getTrackItemOffset()
    const tx = -(position * trackItemOffset) + dragDeltaX

    track.style.transition = animated
      ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'none'
    track.style.transform = `translateX(${tx}px)`

    track.style.perspective = '1000px'
    track.style.perspectiveOrigin = `${position * trackItemOffset + itemWidth / 2}px 50%`

    // rotateY per item
    allItems.forEach((item, index) => {
      const range = [
        -(index + 1) * trackItemOffset,
        -index * trackItemOffset,
        -(index - 1) * trackItemOffset,
      ]
      const outRange = [90, 0, -90]
      const currentX = tx
      let rotateY = 0

      if (currentX <= range[0]) {
        rotateY = outRange[0]
      } else if (currentX >= range[2]) {
        rotateY = outRange[2]
      } else if (currentX <= range[1]) {
        const t = (currentX - range[0]) / (range[1] - range[0])
        rotateY = outRange[0] + t * (outRange[1] - outRange[0])
      } else {
        const t = (currentX - range[1]) / (range[2] - range[1])
        rotateY = outRange[1] + t * (outRange[2] - outRange[1])
      }

      item.style.transform = `rotateY(${rotateY}deg)`
    })

    // Update dots
    const realIdx = getRealIndex()
    dots.forEach((dot, i) =>
      dot.classList.toggle('is-active', i === realIdx),
    )
  }

  // Instant jump (no animation) to fix loop seam
  function jumpTo(index) {
    position = index
    dragDeltaX = 0
    render(false)
  }

  function goTo(index) {
    if (isAnimating) return
    if (index === position) return

    isAnimating = true
    position = index
    dragDeltaX = 0
    render(true)

    const onDone = () => {
      track.removeEventListener('transitionend', onDone)
      // If we landed on a clone, jump to the real counterpart
      if (position === 0) {
        jumpTo(realCount)
      } else if (position === realCount + 1) {
        jumpTo(1)
      }
      isAnimating = false
    }

    track.addEventListener('transitionend', onDone)

    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      if (isAnimating) onDone()
    }, 700)
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer)
    autoplayTimer = setInterval(() => goTo(position + 1), 2000)
  }

  // Click anywhere to go next
  upgradeSection.addEventListener('click', (e) => {
    if (Math.abs(e.clientX - startX) < 5) {
      goTo(position + 1)
      resetAutoplay()
    }
  })

  // Mouse drag
  upgradeSection.addEventListener('mousedown', (e) => {
    isDragging = true
    startX = e.clientX
    dragDeltaX = 0
    e.preventDefault()
  })

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    dragDeltaX = e.clientX - startX
    render(false)
  })

  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return
    isDragging = false

    const dx = e.clientX - startX
    if (dx < -50) {
      dragDeltaX = 0
      goTo(position + 1)
      resetAutoplay()
    } else if (dx > 50) {
      dragDeltaX = 0
      goTo(position - 1)
      resetAutoplay()
    } else {
      dragDeltaX = 0
      render(true)
    }
  })

  // Touch
  let touchStartX = 0
  upgradeSection.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX
      startX = touchStartX
      dragDeltaX = 0
    },
    { passive: true },
  )

  upgradeSection.addEventListener(
    'touchmove',
    (e) => {
      dragDeltaX = e.touches[0].clientX - touchStartX
      render(false)
    },
    { passive: true },
  )

  upgradeSection.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (dx < -50) {
      dragDeltaX = 0
      goTo(position + 1)
      resetAutoplay()
    } else if (dx > 50) {
      dragDeltaX = 0
      goTo(position - 1)
      resetAutoplay()
    } else {
      dragDeltaX = 0
      render(true)
    }
  })

  // Dots — map dot index to real position (index + 1 because of prepended clone)
  dots.forEach((dot, i) => dot.addEventListener('click', (e) => {
    e.stopPropagation()
    goTo(i + 1)
    resetAutoplay()
  }))

  // Init
  function initCarousel() {
    const containerWidth = upgradeSection.offsetWidth - 32
    allItems.forEach((item) => {
      item.style.width = `${containerWidth}px`
    })
    render(false)
  }

  initCarousel()
  window.addEventListener('resize', initCarousel)

  // Autoplay
  let autoplayTimer = setInterval(() => goTo(position + 1), 2000)

  upgradeSection.addEventListener('mouseenter', () => clearInterval(autoplayTimer))
  upgradeSection.addEventListener('mouseleave', resetAutoplay)
}

$(function () {
  const $wrapper = $('.industries__items')
  if (!$wrapper.length) return

  const $items = $wrapper.children()
  const $track = $('<div class="industries__track"></div>').append($items)

  $items.clone().attr('aria-hidden', 'true').appendTo($track)

  $wrapper.append($track)

  const track = $track[0]
  track.style.animation = 'none'

  let offset = 0
  let halfWidth = 0
  let speed = 0
  let extra = 0
  let lastTime = performance.now()

  function measure() {
    halfWidth = track.scrollWidth / 2
    speed = halfWidth / 60000
    if (halfWidth > 0) {
      offset = ((offset % halfWidth) + halfWidth) % halfWidth
    }
  }
  measure()
  $(window).on('resize', measure)

  $track.find('img').each(function () {
    if (this.complete) return
    this.addEventListener('load', measure, { once: true })
    this.addEventListener('error', measure, { once: true })
  })

  function tick(now) {
    const dt = now - lastTime
    lastTime = now

    let dx = speed * dt
    if (extra > 0) {
      const bonus = Math.min(extra, speed * dt * 10)
      dx += bonus
      extra -= bonus
    }

    offset += dx
    while (offset >= halfWidth) offset -= halfWidth
    track.style.transform = `translate3d(${-offset}px, 0, 0)`
    requestAnimationFrame(tick)
  }
  requestAnimationFrame((t) => {
    lastTime = t
    tick(t)
  })

  $track.on('click', '.industries-item', function () {
    const itemWidth = this.getBoundingClientRect().width
    const gap = parseFloat(getComputedStyle(track).gap) || 0
    extra += itemWidth + gap
  })
})

// Recommended solutions — sticky photo changes as items scroll into view
function initRecommendedSolutions() {
  if ($(window).width() <= 479) return true

  const $container = $('.recommended-solutions__content')
  if (!$container.length) return false

  const items = $container[0].querySelectorAll('.recommended-solutions-item')
  const $photo = $container.find('.recommended-solutions__photo')
  if (!items.length || !$photo.length) return false

  function buildSrcset(url) {
    if (!url.endsWith('.webp')) return ''
    const base = url.slice(0, -5)
    return `${base}-p-500.webp 500w, ${base}-p-800.webp 800w, ${base}-p-1080.webp 1080w, ${url} 1548w`
  }

  let currentUrl = $photo.attr('src')

  function swapPhoto(url) {
    if (!url || url === currentUrl) return
    currentUrl = url

    gsap.to($photo, {
      opacity: 0,
      scale: 0.94,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        $photo.attr('src', url)
        const srcset = buildSrcset(url)
        if (srcset) $photo.attr('srcset', srcset)
        gsap.to($photo, {
          opacity: 1,
          scale: 1,
          duration: 0.45,
          ease: 'power2.out',
        })
      },
    })
  }

  gsap.fromTo(
    $photo,
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out', delay: 0.15 },
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          swapPhoto(entry.target.getAttribute('data-photo'))
        }
      })
    },
    {
      rootMargin: '-15% 0px -80% 0px',
      threshold: 0,
    },
  )

  items.forEach((item) => observer.observe(item))
  return true
}

// Poll for the element to appear (Webflow CMS may inject it after load)
;(function pollForRecommended() {
  if (initRecommendedSolutions()) return

  let tries = 0
  const interval = setInterval(() => {
    tries++
    if (initRecommendedSolutions() || tries > 50) {
      clearInterval(interval)
    }
  }, 200)
})()

// Product configurator — crossfade image on variant click
;(function initProductConfigurator() {
  const $configs = $('.product-configurator')
  if (!$configs.length) return

  const MAIN_CONTROLS =
    '.product-configurator-controls:not(.product-configurator-controls--secondary)'
  const SECONDARY_CONTROLS = '.product-configurator-controls--secondary'

  function syncActive($allVars, value) {
    $allVars.removeClass('is-active')
    $allVars.filter(`[data-config-image-show="${value}"]`).addClass('is-active')
  }

  $configs.each(function () {
    const $config = $(this)

    // Main: activate first clickable value across all main control blocks
    const $allMainVars = $config.find(
      `${MAIN_CONTROLS} .product-configurator-controls__var`,
    )
    const $firstMain = $allMainVars.filter('[data-config-image-show]').first()
    if ($firstMain.length) {
      const initialIndex = $firstMain.attr('data-config-image-show')
      syncActive($allMainVars, initialIndex)

      const $images = $config.find('.product-configurator-item')
      $images.removeClass('is-active')
      $images
        .filter(`[data-config-image="${initialIndex}"]`)
        .addClass('is-active')
    }

    // Secondary: activate first secondary value; additionals visible by default
    const $allSecondaryVars = $config.find(
      `${SECONDARY_CONTROLS} .product-configurator-controls__var`,
    )
    const $firstSecondary = $allSecondaryVars
      .filter('[data-config-image-show]')
      .first()
    if ($firstSecondary.length) {
      const initialIndex = $firstSecondary.attr('data-config-image-show')
      syncActive($allSecondaryVars, initialIndex)
      $config.find('.product-configurator-item-additional').css('opacity', 1)
    }
  })

  // Main configurator — crossfade main image
  $(document).on(
    'click',
    `${MAIN_CONTROLS} .product-configurator-controls__var[data-config-image-show]`,
    function () {
      const $var = $(this)
      if ($var.hasClass('is-active')) return

      const targetIndex = $var.attr('data-config-image-show')
      const $config = $var.closest('.product-configurator')
      const $items = $config.find('.product-configurator__items')
      const $allMainVars = $config.find(
        `${MAIN_CONTROLS} .product-configurator-controls__var`,
      )

      syncActive($allMainVars, targetIndex)

      const $current = $items.find('.product-configurator-item.is-active')
      const $target = $items.find(
        `.product-configurator-item[data-config-image="${targetIndex}"]`,
      )
      if (!$target.length || $target.is($current)) return

      gsap.to($current, {
        opacity: 0,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          $current.removeClass('is-active').css('opacity', '')
        },
      })

      $target.addClass('is-active')
      gsap.fromTo(
        $target,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.inOut',
          clearProps: 'opacity',
        },
      )
    },
  )

  // Secondary configurator — toggle additional images: first var shows, others hide
  $(document).on(
    'click',
    `${SECONDARY_CONTROLS} .product-configurator-controls__var[data-config-image-show]`,
    function () {
      const $var = $(this)
      if ($var.hasClass('is-active')) return

      const targetIndex = $var.attr('data-config-image-show')
      const $vars = $var.closest('.product-configurator-controls__vars')
      const $config = $var.closest('.product-configurator')
      const $allSecondaryVars = $config.find(
        `${SECONDARY_CONTROLS} .product-configurator-controls__var`,
      )
      const $clickable = $vars.find(
        '.product-configurator-controls__var[data-config-image-show]',
      )
      const isFirst = $clickable.index($var) === 0

      syncActive($allSecondaryVars, targetIndex)

      gsap.to($config.find('.product-configurator-item-additional'), {
        opacity: isFirst ? 1 : 0,
        duration: 0.35,
        ease: 'power2.inOut',
      })
    },
  )

  // Intro furniture — switch image by clicked var index (instant, no fade)
  $(document).on(
    'click',
    '.product-configurator-controls--intro .product-configurator-controls__var[data-config-image-show]',
    function () {
      const $var = $(this)
      if ($var.hasClass('is-active')) return

      const $vars = $var.closest('.product-configurator-controls__vars')
      const $clickable = $vars.find(
        '.product-configurator-controls__var[data-config-image-show]',
      )
      const index = $clickable.index($var)

      const $intro = $var.closest('.intro-furniture')
      const $images = $intro.find('.intro-furniture__image')
      if (!$images.length) return

      $vars.find('.product-configurator-controls__var').removeClass('is-active')
      $var.addClass('is-active')

      $images.removeClass('is-active')
      $images.eq(index).addClass('is-active')
    },
  )
})()

// How get started — switch screenshot + animate progress dec on step click
;(function initHowGetStarted() {
  if ($(window).width() <= 479) return

  const $sections = $('.how-get-started__in')
  if (!$sections.length) return

  function updateDec($section, animate) {
    const $itemsCont = $section.find('.how-get-started__items')
    const $items = $section.find('.how-get-started-item')
    const $active = $items.filter('.is-active').first()
    const $dec = $section.find('.how-get-started-item__dec')
    if (!$active.length || !$dec.length || !$itemsCont.length) return

    const idx = $items.index($active)
    $items.removeClass('is-passed')
    $items.slice(0, idx).addClass('is-passed')

    const contTop = $itemsCont[0].getBoundingClientRect().top
    const activeBottom = $active[0].getBoundingClientRect().bottom
    const height = activeBottom - contTop

    gsap.to($dec[0], {
      height,
      duration: animate ? 0.5 : 0,
      ease: 'power2.inOut',
      overwrite: true,
    })
  }

  $sections.each(function () {
    updateDec($(this), false)
  })

  // Recalc after fonts/images load + on resize
  $(window).on('load', () => {
    $sections.each(function () {
      updateDec($(this), false)
    })
  })

  let resizeTimer
  $(window).on('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      $sections.each(function () {
        updateDec($(this), false)
      })
    }, 100)
  })

  $(document).on('click', '.how-get-started-item', function () {
    const $item = $(this)
    if ($item.hasClass('is-active')) return

    const $section = $item.closest('.how-get-started__in')
    const $items = $section.find('.how-get-started-item')
    const $screenshots = $section.find('.how-get-started__screenshot')
    const index = $items.index($item)

    $items.removeClass('is-active')
    $item.addClass('is-active')

    $screenshots.removeClass('is-active')
    $screenshots.eq(index).addClass('is-active')

    updateDec($section, true)
  })
})()

// Product Launch — pin section, scroll items horizontally, grow each item's dec
$(window).on('load', function initProductLaunch() {
  const track = document.querySelector('.product-launch__items')
  if (!track) return

  const section = track.closest('.product-launch') || track.parentElement
  const items = Array.from(track.querySelectorAll('.product-launch-item'))
  if (!section || !items.length) return

  gsap.registerPlugin(ScrollTrigger)
  const pinTarget = section.closest('.product-launch-wrapper') || section

  const getHeaderOffset = () => {
    const header = document.querySelector('.header')
    if (!header) return 0

    const headerStyle = window.getComputedStyle(header)
    if (!['fixed', 'sticky'].includes(headerStyle.position)) return 0

    return header.getBoundingClientRect().height || 0
  }

  const getDistance = () => {
    const firstItem = items[0]
    const lastItem = items[items.length - 1]
    const alignLastItemDistance = lastItem.offsetLeft - firstItem.offsetLeft

    return Math.max(alignLastItemDistance, 0)
  }

  const getScrollFactor = () => {
    const rawFactor = window
      .getComputedStyle(pinTarget)
      .getPropertyValue('--product-launch-scroll-factor')
    const factor = parseFloat(rawFactor)

    return Number.isFinite(factor) && factor > 0 ? factor : 1
  }

  const getScrollDistance = () => getDistance() * getScrollFactor()

  const media = gsap.matchMedia()

  media.add('(min-width: 480px)', () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinTarget,
        pin: pinTarget,
        scrub: 1,
        start: () => `top top+=${getHeaderOffset()}`,
        end: () => '+=' + getScrollDistance(),
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    })

    tl.to(
      track,
      { x: () => -getDistance(), ease: 'none', duration: items.length },
      0,
    )

    // Each dec grows during its 1-unit slot — sequential reveal as user scrolls
    items.forEach((item, i) => {
      const dec = item.querySelector('.product-launch-item__dec')
      if (!dec) return

      tl.fromTo(
        dec,
        { width: 0 },
        { width: '15rem', ease: 'none', duration: 1 },
        i,
      )
    })

    return () => {
      tl.kill()
      gsap.set(track, { clearProps: 'transform' })
      items.forEach((item) => {
        const dec = item.querySelector('.product-launch-item__dec')
        if (dec) gsap.set(dec, { clearProps: 'width' })
      })
    }
  })

})

// Tables
const blogTables = document.querySelectorAll('.blog-post-body table')
if (blogTables.length) {
  blogTables.forEach((table) => {
    table.removeAttribute('class')

    if (table.parentElement.classList.contains('vivid-table-wrap')) return

    const wrap = document.createElement('div')
    wrap.classList.add('vivid-table-wrap')
    table.parentNode.insertBefore(wrap, table)
    wrap.appendChild(table)
  })


}

// Intro Simulation Tabs — auto-rotate illustrations every 5s with subtle slide
document.querySelectorAll('.intro-simulation-tabs__item').forEach((tabItem) => {
  const slides = tabItem.querySelectorAll('.intro-simulation-tabs__illustration')
  if (slides.length < 2) return

  let activeIndex = Array.from(slides).findIndex((s) =>
    s.classList.contains('is-active'),
  )
  if (activeIndex < 0) {
    activeIndex = 0
    slides[0].classList.add('is-active')
  }

  let timer

  const goTo = (nextIndex) => {
    if (nextIndex === activeIndex) return
    const current = slides[activeIndex]
    const next = slides[nextIndex]

    gsap.to(current, {
      opacity: 0,
      scale: 1.015,
      duration: 0.5,
      ease: 'power2.out',
      onComplete: () => {
        current.classList.remove('is-active')
        gsap.set(current, { scale: 1 })
      },
    })

    next.classList.add('is-active')
    gsap.fromTo(
      next,
      { opacity: 0, scale: 0.985 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out',
      },
    )

    activeIndex = nextIndex
  }

  const advance = () => goTo((activeIndex + 1) % slides.length)

  const startTimer = () => {
    clearInterval(timer)
    timer = setInterval(advance, 5000)
  }

  startTimer()

  slides.forEach((slide) => {
    slide.addEventListener('click', () => {
      advance()
      startTimer()
    })
  })
})

// Intro Simulation — tab switcher (click tab → show item; swipe on mobile)
document.querySelectorAll('.intro-simulation__tabs').forEach((wrap) => {
  const tabs = Array.from(
    wrap.querySelectorAll('.intro-simulation-controls__tab'),
  )
  const items = Array.from(
    wrap.querySelectorAll(
      '.intro-simulation-tabs > .intro-simulation-tabs__item',
    ),
  )
  if (!tabs.length || !items.length) return

  const setActive = (i) => {
    if (i < 0 || i >= tabs.length) return
    if (tabs[i].classList.contains('is-active')) return
    tabs.forEach((t) => t.classList.remove('is-active'))
    tabs[i].classList.add('is-active')
    items.forEach((item) => item.classList.remove('is-active'))
    if (items[i]) items[i].classList.add('is-active')
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setActive(i))
  })

  // Mobile swipe (≤479px) on the whole intro-simulation block
  let touchStartX = 0
  let touchStartY = 0
  let tracking = false

  wrap.addEventListener(
    'touchstart',
    (e) => {
      if (window.innerWidth > 479) return
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
      tracking = true
    },
    { passive: true },
  )

  wrap.addEventListener(
    'touchend',
    (e) => {
      if (!tracking) return
      tracking = false
      const dx = e.changedTouches[0].clientX - touchStartX
      const dy = e.changedTouches[0].clientY - touchStartY
      if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return

      const currentIndex = tabs.findIndex((t) =>
        t.classList.contains('is-active'),
      )
      if (currentIndex < 0) return

      setActive(dx < 0 ? currentIndex + 1 : currentIndex - 1)
    },
    { passive: true },
  )
})

// Background video — apply data-video-speed as playbackRate
document.querySelectorAll('[data-video-speed]').forEach((wrap) => {
  const speed = parseFloat(wrap.getAttribute('data-video-speed'))
  if (!speed || !isFinite(speed)) return
  const video = wrap.querySelector('video')
  if (!video) return
  const apply = () => {
    video.playbackRate = speed
  }
  apply()
  video.addEventListener('loadedmetadata', apply)
  video.addEventListener('play', apply)
})

// Intro Animated — scattered visuals reassemble on scroll, header entrance, gradient shimmer
if (document.querySelector('.intro-animated')) {
  gsap.registerPlugin(ScrollTrigger)

  // Shared flag: true once visuals have landed in their slots (scrub end reached)
  let visualsLanded = false
  const introVideos = () =>
    document.querySelectorAll(
      '.intro-animated__items .intro-animated-item__visual video',
    )
  const playIntroVideos = () =>
    introVideos().forEach((v) => v.play().catch(() => {}))
  const pauseIntroVideos = () => introVideos().forEach((v) => v.pause())

  // 1) Page-load entrance for header gradient row — each item (and divider
  //     between them) fades up in DOM order; nothing animates inside an item.
  const gradientWrap = document.querySelector('.intro-animated__gradient')
  if (gradientWrap) {
    const sequence = Array.from(gradientWrap.children)
    gsap.from(sequence, {
      opacity: 0,
      y: 14,
      duration: 0.55,
      stagger: 0.18,
      ease: 'power2.out',
      delay: 0.2,
    })
  }

  // 1b) Decorative floating icons — sharp bounce, all in unison on page load
  const decoIcons = document.querySelectorAll('.intro-animated__icon')
  const playDecoIcons = () => {
    if (!decoIcons.length) return
    gsap.to(decoIcons, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1.1, 0.32)',
      overwrite: true,
    })
  }
  const hideDecoIcons = () => {
    if (!decoIcons.length) return
    gsap.to(decoIcons, {
      opacity: 0,
      scale: 0,
      duration: 0.4,
      overwrite: true,
    })
  }
  if (decoIcons.length) {
    gsap.set(decoIcons, {
      opacity: 0,
      scale: 0,
      transformOrigin: 'center center',
    })
    // Play immediately on page load (no scroll trigger)
    gsap.delayedCall(0.3, playDecoIcons)
  }

  // 2) Scattered visuals → assembled on scroll (desktop/tablet only)
  const mmAnim = gsap.matchMedia()
  mmAnim.add('(min-width: 768px)', () => {
    const section = document.querySelector('.intro-animated')
    const inner = section?.querySelector('.intro-animated__in')
    const title = section?.querySelector('.intro-animated__title')
    const description = section?.querySelector('.intro-animated__description')
    const visuals = gsap.utils.toArray(
      '.intro-animated__items .intro-animated-item__visual',
    )
    if (!section || !title || !visuals.length) return

    // Compute per-card scatter delta from grid position to design target
    let scatterOffsets = []
    const computeScatter = () => {
      // Reset transforms so getBoundingClientRect returns grid position
      gsap.set(visuals, { x: 0, y: 0, rotation: 0 })

      // Horizontal anchor = inner content block (.container-constrained), not the full-bleed section
      const innerRect = (inner || section).getBoundingClientRect()
      const sectionRect = section.getBoundingClientRect()
      const titleRect = title.getBoundingClientRect()
      const descRect = (description || title).getBoundingClientRect()

      return visuals.map((v, i) => {
        const r = v.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2

        let tx, ty, rot
        if (i === 0) {
          // Blue: ~60% hangs off inner block's left edge, at title vertical center
          tx = innerRect.left - r.width * 0.1
          ty = titleRect.top + titleRect.height / 2
          rot = -10
        } else if (i === 1) {
          // Green: centered over inner block, top ~15% above section top
          tx = innerRect.left + innerRect.width / 2
          ty = sectionRect.top + r.height * 0.8
          rot = 7
        } else {
          // Red: ~60% hangs off inner block's right edge, at description vertical center
          tx = innerRect.right + r.width * 0.1
          ty = descRect.top + descRect.height / 2
          rot = 12
        }

        return { x: tx - cx, y: ty - cy, rotation: rot }
      })
    }

    // Scatter→assemble for the videos is disabled — they sit in their slots
    // from the start. Other intro-animated animations (2b, 2c, gradient, icons,
    // header entrance, video hover) keep working unchanged.
    // scatterOffsets = computeScatter()
    // gsap.fromTo(
    //   visuals,
    //   {
    //     x: (i) => scatterOffsets[i]?.x ?? 0,
    //     y: (i) => scatterOffsets[i]?.y ?? 0,
    //     rotation: (i) => scatterOffsets[i]?.rotation ?? 0,
    //     scale: 1.1,
    //   },
    //   {
    //     x: 0,
    //     y: 0,
    //     rotation: 0,
    //     scale: 1,
    //     ease: 'none',
    //     scrollTrigger: {
    //       trigger: '.intro-animated',
    //       start: 'top top',
    //       endTrigger: '.intro-animated__items',
    //       end: () =>
    //         window.matchMedia('(min-width: 1900px)').matches
    //           ? 'top center'
    //           : 'bottom bottom+=200',
    //       scrub: 1,
    //       invalidateOnRefresh: true,
    //       onRefreshInit: () => {
    //         scatterOffsets = computeScatter()
    //       },
    //       onLeave: () => {
    //         visualsLanded = true
    //         playIntroVideos()
    //       },
    //       onEnterBack: () => {
    //         visualsLanded = false
    //         pauseIntroVideos()
    //       },
    //     },
    //   },
    // )

    // 2b) Visual backdrop push disabled — keep a bare ScrollTrigger to still
    //     fire the deco icons reveal at the same scroll point.
    const VISUAL_PUSH_PX = 280
    // const visualBackdrop = document.querySelector('.intro-animated__visual')
    // if (visualBackdrop && section) {
    //   gsap.to(visualBackdrop, {
    //     y: VISUAL_PUSH_PX,
    //     ease: 'none',
    //     scrollTrigger: {
    //       trigger: '.intro-animated',
    //       start: 'top top',
    //       end: `+=${VISUAL_PUSH_PX}`,
    //       scrub: true,
    //       onLeave: playDecoIcons,
    //       onEnterBack: hideDecoIcons,
    //     },
    //   })
    // }
    // (deco icons play immediately on load now — no scroll trigger needed)

    // 2c) Translate .intro-animated__top — disabled (commented out)
    // const topBlock = document.querySelector('.intro-animated__top')
    // if (topBlock) {
    //   gsap.to(topBlock, {
    //     y: '10rem',
    //     ease: 'none',
    //     scrollTrigger: {
    //       trigger: '.intro-animated',
    //       start: 'top top',
    //       endTrigger: '.intro-animated__title',
    //       end: 'top top',
    //       scrub: true,
    //     },
    //   })
    // }
  })

  // 3) Gradient shimmer on .intro-animated__dec while section is in view
  const dec = document.querySelector('.intro-animated__dec')
  if (dec) {
    gsap.fromTo(
      dec,
      { backgroundPosition: '0% 0%', rotation: -3 },
      {
        backgroundPosition: '100% 100%',
        rotation: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: '.intro-animated',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
  }

  // 4) Videos: autoplay + loop on all screen sizes
  document
    .querySelectorAll('.intro-animated__items .intro-animated-item__visual')
    .forEach((visual) => {
      const video = visual.querySelector('video')
      if (!video) return
      video.loop = true
      video.muted = true
      video.setAttribute('playsinline', '')
      const tryPlay = () => video.play().catch(() => {})
      tryPlay()
      video.addEventListener('loadedmetadata', tryPlay)
      video.addEventListener('canplay', tryPlay)
    })
}

// Tilted-card hover effect on .complex-catalogs-item (≥480px)
document.querySelectorAll('.complex-catalogs-item').forEach((card) => {
  const ROTATE_AMP = 12
  const SCALE_HOVER = 1.05
  const isDesktop = () => window.matchMedia('(min-width: 480px)').matches

  gsap.set(card, {
    transformPerspective: 800,
    transformStyle: 'preserve-3d',
    transformOrigin: 'center center',
  })

  const rotXTo = gsap.quickTo(card, 'rotationX', {
    duration: 0.55,
    ease: 'power3.out',
  })
  const rotYTo = gsap.quickTo(card, 'rotationY', {
    duration: 0.55,
    ease: 'power3.out',
  })
  const scaleTo = gsap.quickTo(card, 'scale', {
    duration: 0.55,
    ease: 'power3.out',
  })

  card.addEventListener('mousemove', (e) => {
    if (!isDesktop()) return
    const rect = card.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    rotXTo((offsetY / (rect.height / 2)) * -ROTATE_AMP)
    rotYTo((offsetX / (rect.width / 2)) * ROTATE_AMP)
  })

  card.addEventListener('mouseenter', () => {
    if (!isDesktop()) return
    scaleTo(SCALE_HOVER)
  })

  card.addEventListener('mouseleave', () => {
    scaleTo(1)
    rotXTo(0)
    rotYTo(0)
  })
})

// Webflow Lottie autoplay reliability fix —
// lazy-loaded autoplay Lotties sometimes don't start due to a race between
// IX2 / IntersectionObserver and the cached SVG. Strip the lazy flag and
// re-init Webflow's Lottie + IX2 modules once everything settled.
function ensureWebflowLottiesPlay() {
  const lotties = document.querySelectorAll(
    '[data-animation-type="lottie"][data-autoplay="1"]',
  )
  if (!lotties.length) return

  lotties.forEach((el) => {
    if (el.getAttribute('data-loading') === 'lazy') {
      el.removeAttribute('data-loading')
    }
  })

  if (window.Webflow && typeof window.Webflow.require === 'function') {
    try {
      const lottieMod = window.Webflow.require('lottie')
      lottieMod?.ready?.()
      lottieMod?.init?.()
      window.Webflow.require('ix2')?.init?.()
    } catch (e) {
      /* no-op */
    }
  }
}

if (document.readyState === 'complete') {
  ensureWebflowLottiesPlay()
} else {
  window.addEventListener('load', ensureWebflowLottiesPlay)
}

// Fade + scale (0.3 -> 1) for [data-animation-name="video"] blocks on enter viewport
function initVideoBlocksAnimation() {
  const blocks = document.querySelectorAll('[data-animation-name="video"]')
  if (!blocks.length) return

  gsap.registerPlugin(ScrollTrigger)

  blocks.forEach((block) => {
    gsap.fromTo(
      block,
      { opacity: 0, scale: 0.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: block,
          start: 'top 85%',
          once: true,
        },
      },
    )
  })
}

initVideoBlocksAnimation()

// How it works — arrows fade in left-to-right, staggered, on enter viewport
function initHowItWorksArrows() {
  const groups = document.querySelectorAll('.how-it-works__items')
  if (!groups.length) return

  gsap.registerPlugin(ScrollTrigger)

  groups.forEach((group) => {
    const icons = group.querySelectorAll('.how-it-works-item__icon')
    if (!icons.length) return

    gsap.fromTo(
      icons,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          once: true,
        },
      },
    )
  })
}

initHowItWorksArrows()

// Why robotics — items fade in up (staggered), visual scales 0.3 -> 1
function initWhyRoboticsAnimation() {
  const groups = document.querySelectorAll('.why-robotics__body')
  if (!groups.length) return

  gsap.registerPlugin(ScrollTrigger)

  groups.forEach((group) => {
    const items = group.querySelectorAll('.why-robotics-item')
    const visual = group.querySelector('.why-robotics__visual')

    const st = {
      trigger: group,
      start: 'top 80%',
      once: true,
    }

    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: st,
        },
      )
    }

    if (visual) {
      gsap.fromTo(
        visual,
        { opacity: 0, scale: 0.3 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: st,
        },
      )
    }
  })
}

initWhyRoboticsAnimation()
