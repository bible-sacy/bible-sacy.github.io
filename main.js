const sacy_be_init = (canonicalArg, baseArg, documentTitleArg) => {

    const CANONICAL = canonicalArg
    const DOCUMENT_TITLE = documentTitleArg

    const BASE = baseArg
    const PDFS_BASE = `${BASE}pdfs`

    const img = document.getElementById("page")
    const imgPaire = document.getElementById("page-paire")
    const imgImpaire = document.getElementById("page-impaire")
    const chapters = document.getElementById("chapters")
    const pageSelector = document.getElementById("pages")
    const books = document.getElementById("books")
    const pdfLink = document.getElementById("pdfLink")
    const bookInfo = document.getElementById("bookInfo")
    const editionInfo = document.getElementById("editionInfo")
    const displayInfo = document.getElementById("displayInfo")
    const infoIcon = document.getElementById("infoIcon")
    const hideInfo = document.getElementById("hideInfo")
    const infoWindow = document.getElementById("infoWindow")
    const fautes = document.getElementById("fautes")
    const nextTop = document.getElementById("next-top")
    const nextBottom = document.getElementById("next-bottom")
    const prevTop = document.getElementById("prev-top")
    const prevBottom = document.getElementById("prev-bottom")
    const sites = document.getElementById("sites")
    const toggleViewButton = document.getElementById("toggleViewButton")
    const canonical = document.getElementById("canonical")

    var double = false

    {
        // Redirect to the canonical website if hosted on github.io
        const ALWAYS_REDIRECT = false
        const REDIRECT_IF_GITHUB = false
        if (ALWAYS_REDIRECT || (REDIRECT_IF_GITHUB && location.hostname.endsWith('github.io'))) {
            canonical.setAttribute('href', `${CANONICAL}/${location.hash}`)
            const meta = document.createElement('meta')
            meta.httpEquiv = 'refresh'
            meta.content = `0; URL=${CANONICAL}/${location.hash}`
            document.getElementsByTagName('head')[0].appendChild(meta)
        }
    }

    window.addEventListener('popstate', () => {
        if (location.hash && (m = location.hash.match(/#\/(.+)\/(.+)/))) {
            let newBook = m[1]
            let newPage = m[2]
            if (newBook !== books.value) {
                books.value = newBook
                if (!books.value) {
                    currentBook = newBook
                }
                useBook(newBook, newPage)
            } else if (newPage !== pageSelector.value) {
                console.log("setPage from popState with newPage ", newPage)
                setPage(newPage)
            }
        }
    })

    sites.addEventListener("change", ev => {
        ev.preventDefault()
        window.location = sites.selectedOptions[0].value
    })

    let infoShown = false

    const toggleInfo = (ev) => {
        ev.preventDefault()
        if (infoShown) {
            infoIcon.innerText = 'ℹ'
            infoWindow.style.display = 'none'
        } else {
            infoWindow.style.display = ''
            infoIcon.innerText = '❌'
        }
        infoShown = !infoShown
    }

    displayInfo.addEventListener("click", toggleInfo)

    hideInfo.addEventListener("click", toggleInfo)

    let folder = null
    let offset = null
    let max = null
    let min = null
    let pdf = null
    let foldersMap = null
    let bookKeysMap = {}
    let bookList = []
    let currentBook = null

    document.getElementById("page-form").addEventListener("submit", e => e.preventDefault())
    document.getElementById("book-form").addEventListener("submit", e => e.preventDefault())

    books.addEventListener("change", e => {
        useBook(books.value, null)
    })

    fetch(`${BASE}index.json`)
        .then(response => response.json())
        .then(index => {
            index.books.forEach(value => {
                books.options.add(new Option(value[1], value[0]))
                bookKeysMap[value[0]] = value[1]
                bookList.push(value[0])
            })
            foldersMap = index.folders
            if (location.hash && (m = location.hash.match(/#\/(.+)\/(.+)/))) {
                books.value = m[1]
                useBook(m[1], m[2])
                if (!books.value) {
                    currentBook = m[1]
                }
            } else {
                books.value = index.default
                useBook(index.default, null)
            }
        })



    let useBook = (nameArg, page) => fetch(`${BASE}jsons/${nameArg}.json`)
        .then(response => response.json())
        .then(json => {
            //console.log("json is ", json)
            folder = json.folder
            pdf = foldersMap[folder][3]
            offset = json.offset
            max = json.max
            min = json.min
            pages.min = min
            pages.max = max
            while (chapters.options.length) chapters.remove(0);
            json.chapters.forEach(value => {
                chapters.options.add(new Option(value[0], value[1]))
            })
            bookInfo.innerText = foldersMap[folder][0]
            editionInfo.innerText = foldersMap[folder][1] + ", " + foldersMap[folder][2]
            if (pdf && pdf.startsWith("https://")) {
                pdfLink.href = pdf
            } else if (pdf && pdf.startsWith("-")) {
                pdfLink.href = `${PDFS_BASE}${pdf}`
            } else {
                pdfLink.href = `${PDFS_BASE}/${pdf}`
            }
            console.log("setPage from useBook")
            setPage(page ? page : json.chapters[0][1])
        })

    let nextPage = () => {
        if (parseInt(pageSelector.value) < max) {
            if (double && parseInt(pageSelector.value) + 1 < max) {
                pageSelector.value = parseInt(pageSelector.value) + 2
            } else {
                pageSelector.value = parseInt(pageSelector.value) + 1
            }
            if (!double) document.body.scrollTop = document.documentElement.scrollTop = 0
            console.log("update from next")
            update()
        } else {
            let bookIdx = bookList.indexOf(books.value)
            if (bookIdx < bookList.length - 1) {
                books.value = bookList[bookIdx + 1]
                useBook(books.value, 'min')
            }
        }
    }

    let previousPage = () => {
        if (parseInt(pageSelector.value) > min) {
            if (double && parseInt(pageSelector.value) - 1 < max) {
                pageSelector.value = parseInt(pageSelector.value) - 2
            } else {
                pageSelector.value = parseInt(pageSelector.value) - 1
            }
            console.log("update from prev")
            update()
        } else {
            let bookIdx = bookList.indexOf(books.value)
            if (bookIdx > 0) {
                books.value = bookList[bookIdx - 1]
                useBook(books.value, 'max')
            }
        }
    }

    let setPage = p => {
        if (p === 'max') {
            pageSelector.value = max
            console.log("update from setPage")
            update()
        } else if (p === 'min') {
            pageSelector.value = min
            console.log("update from setPage")
            update()
        } else if (p >= min && p <= max) {
            pageSelector.value = parseInt(p)
            console.log("update from setPage")
            update()
        }
    }

    let toggleView = () => {
        double = !double
        update()
        toggleViewButton.innerText = double ? "🗏" : "🗏🗏"
    }

    toggleViewButton.addEventListener('click', toggleView)

    let update = () => {
        console.log("update called…")
        sites.value = CANONICAL
        const page = parseInt(pageSelector.value)
        const pagePaire = ((page % 2) == 0) ? page : page - 1
        const pageImpaire = pagePaire + 1
        const number = offset + page
        const numPair = offset + pagePaire
        const numImpair = offset + pageImpaire
        if (folder.match('/')) {
            const [suffix, f] = folder.split('/', 2)
            if (double) {
                img.src = ''
                img.style.display = 'none'
                imgPaire.style.display = ''
                imgPaire.src = `${BASE}pngs${suffix}/${f}/${f}-${numPair}.png`
                imgImpaire.style.display = ''
                imgImpaire.src = `${BASE}pngs${suffix}/${f}/${f}-${numImpair}.png`
            } else {
                imgPaire.src = ''
                imgPaire.style.display = 'none'
                imgImpaire.src = ''
                imgImpaire.style.display = 'none'
                img.style.display = ''
                img.src = `${BASE}pngs${suffix}/${f}/${f}-${number}.png`
            }
        } else {
            if (double) {
                img.src = ''
                img.style.display = 'none'
                imgPaire.style.display = ''
                imgPaire.src = `${BASE}pngs/${folder}/${folder}-${numPair}.png`
                imgImpaire.style.display = ''
                imgImpaire.src = `${BASE}pngs/${folder}/${folder}-${numImpair}.png`
            } else {
                imgPaire.src = ''
                imgPaire.style.display = 'none'
                imgImpaire.src = ''
                imgImpaire.style.display = 'none'
                img.style.display = ''
                img.src = `${BASE}pngs/${folder}/${folder}-${number}.png`
            }
        }
        if (parseInt(chapters.value) !== page) {
            chapters.value = null;
        }
        if (books.value) {
            location.hash = `/${books.value}/${page}`
        } else {
            location.hash = `/${currentBook}/${page}`
        }
        canonical.setAttribute('href', `${CANONICAL}/${location.hash}`)
        if (foldersMap[folder].length > 4) {
            let corrections = foldersMap[folder][4]
            let correctionPages = []
            for (let correctionPage in corrections) {
                if (double) {
                    if (corrections[correctionPage].find(p => p == pagePaire || p == pageImpaire) !== undefined) {
                        correctionPages.push(correctionPage)
                    }
                } else {
                    if (corrections[correctionPage].find(p => p == page) !== undefined) {
                        correctionPages.push(correctionPage)
                    }
                }
            }
            if (correctionPages.length > 0) {
                showErrors(correctionPages)
            } else {
                clearErrors()
            }
        } else {
            clearErrors()
        }
        if (books.selectedOptions[0]) {
            document.title = `${DOCUMENT_TITLE} : ${books.selectedOptions[0].innerText} p. ${page}`
        }
    }

    let showErrors = (errorArray) => {
        console.log("ERROR DETECTED", errorArray)
        fautes.innerHTML = `Faute(s) à corriger : voir ` +
            errorArray.map(p => `<a href="#/${p}">${bookKeysMap[p.split('/')[0]]} page ${p.split('/')[1]}</a>`).join(", ") +
            "."
    }

    let clearErrors = () => {
        fautes.innerHTML = ''
    }

    pageSelector.addEventListener("change", update)

    chapters.addEventListener("change", event => {
        // console.log("event is ", event)
        setPage(chapters.value)
    })



    document.addEventListener('keydown', event => {
        // console.log("event is ", event)
        switch (event.key) {
            case 'ArrowRight':
                nextPage()
                break
            case 'ArrowLeft':
                previousPage()
                break
        }
    })

    nextTop.addEventListener("click", nextPage)
    nextBottom.addEventListener("click", nextPage)
    prevTop.addEventListener("click", previousPage)
    prevBottom.addEventListener("click", previousPage)

    const swipeElement = document.getElementById('hammer');
    const mc = new Hammer(swipeElement);    
    mc.on('swipeleft', ev => {
        console.log("gesture : swipeleft")
        nextPage()
    })
    mc.on('swiperight', ev => {
        console.log("gesture : swiperight")
        previousPage()
    })
}