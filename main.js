const sacy_be_init = (canonicalArg, baseArg, documentTitleArg) => {

const CANONICAL = canonicalArg
const DOCUMENT_TITLE = documentTitleArg
const BASE = baseArg
const PDFS_BASE = `${BASE}pdfs`

const CANONICAL_NODE = document.getElementById("canonical")

const state = {
    loading: true,
    showInfo: false,
    displayMode : 'onePage', // 'onePage' or 'twoPages'
    indexData: null, // content of index.json
    currentBook: null,
    bookData: null,  // content of <currentBook>.json
    currentPage: null
}

const mutations = {
    /**
     * Set the initial state.
     */
    init (state, {indexData, currentBook, bookData, currentPage}) {
        state.indexData = indexData
        state.bookData = bookData
        state.currentBook = currentBook
        state.currentPage = currentPage
        state.loading = false
    },
    /**
     * Show or hide the info section.
     */
    toggleInfo (state) {
        state.showInfo = !state.showInfo
    },
    /**
     * Display with one or two pages.
     */
    toggleDisplayMode (state) {
        state.displayMode = state.displayMode === 'onePage' ? 'twoPages' : 'onePage'
    },
    /**
     * Go to the given page of the same book.
     */
    changePageInSameBook (state, page) {
        if (page >= state.bookData.min && page <= state.bookData.max) {
            state.currentPage = page
        } else {
            console.warn("changePageInSameBook: page ", page, "is not valid.")
        }
    },
    /**
     * Go to a different book.
     */
    loadNewBook (state, {currentBook, bookData, currentPage}) {
        state.bookData = bookData
        state.currentBook = currentBook
        state.currentPage = currentPage
    }
}

/**
 * Returns the img src from the state and the image number.
 */
const getImgSrc =  (state, number) => {
    const folder = state.bookData.folder
    if (folder.match('/')) {
        const [suffix, f] = folder.split('/', 2)
        return `${BASE}pngs${suffix}/${f}/${f}-${number}.png`
    } else {
        return `${BASE}pngs/${folder}/${folder}-${number}.png`
    }
}

const getPagePaire = (state) => {
    if (state.loading) return null
    const page = state.currentPage
    return ((page % 2) == 0) ? page : page - 1
}

const getPageImpaire = (state) => getPagePaire(state) + 1

const getRightOrOnlyPage = (state) => {
    if (state.displayMode === 'twoPages') return getPageImpaire(state)
    return state.currentPage
}

const convertToRoman = (num) => {
    if (!Number.isInteger(num)) return num
    var roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1
    };
    var str = '';
  
    for (var i of Object.keys(roman)) {
      var q = Math.floor(num / roman[i]);
      num -= q * roman[i];
      str += i.repeat(q);
    }
  
    return str;
}

const getPreviousBook = (state, key) => {
    if (state.loading) return null
    const idx = state.indexData.books.findIndex(a => a[0] == key)
    if (idx - 1 >= 0)
        return state.indexData.books[idx - 1][0]
    else
        return null
}

const getNextBook = (state, key) => {
    const idx = state.indexData.books.findIndex(a => a[0] == key)
    if (idx + 1 < state.indexData.books.length)
        return state.indexData.books[idx + 1][0]
    else
        return null
}

const getters  = {
    /**
     * Display name of the current book.
     */
    currentBookDisplayName (state) {
        if (state.loading) return null
        return state.indexData.books.filter(b => b[0] == state.currentBook)[0][1]
    },
    /**
     * The list of books as {key, label}.
     */
    books (state) {
        if (state.loading) return null
        return state.indexData.books.map(a => { return {
            key: a[0],
            label: a[1]
        }})
    },
    /**
     * Name (key) of the previous book, if it exists.
     */
    previousBook (state) {
        if (state.loading) return null
        return getPreviousBook(state, state.currentBook)
    },
    /**
     * Name (key) of the next book, if it exists.
     */
    nextBook (state) {
        if (state.loading) return null
        return getNextBook(state, state.currentBook)
    },
    /**
     * The list of chapters of the current book as {title, page, next},
     * where next is the last page of the chapter.
     */
    chapters (state) {
        if (state.loading) return null
        let l = []
        for (let i = 0; i < state.bookData.chapters.length; ++i) {
            const c = state.bookData.chapters[i]
            let last = state.bookData.max
            if (i < state.bookData.chapters.length - 1)
                last = state.bookData.chapters[i+1][1] - 1
            l.push({
                roman: convertToRoman(c[0]),
                title: c[0],
                page: c[1],
                last
            })
        }
        return l
    },
    /**
     * Returns the current chapter as {title, page, next},
     * where next is the last page of the chapter.
     */
    currentChapter (state, getters) {
        if (state.loading) return null
        const chapters = getters.chapters
        const currentPage = state.currentPage
        return chapters.filter(chapter =>
            currentPage >= chapter.page && currentPage <= chapter.last
        )[0]
    },
    /**
     * The src of the image, whene displayMode is 'onePage'.
     */
    currentPageImgSrc (state) {
        if (state.loading) return null
        const number = state.currentPage + state.bookData.offset
        return getImgSrc(state, number)
    },
    /**
     * The src of the left image, when displayMode is 'twoPages'
     */
    currentPageImgPaireSrc (state) {
        const numPair = state.bookData.offset + getPagePaire(state)
        return getImgSrc(state, numPair)
    },
    /**
     * The src of the right image, when displayMode is 'twoPages'
     */
    currentPageImgImpaireSrc (state) {
        if (state.loading) return null
        const numImpair = state.bookData.offset + getPageImpaire(state)
        return getImgSrc(state, numImpair)
    },
    /**
     * Book name shown on the info div.
     */
    bookInfo (state) {
        if (state.loading) return null
        return state.indexData.folders[state.bookData.folder][0]
    },
    /**
     * Edition information shown on the info div.
     */
    editionInfo (state) {
        if (state.loading) return null
        const info = state.indexData.folders[state.bookData.folder]
        return info[1] + ", " + info[2]
    },
    /**
     * href of the pdf
     */
    pdfLink (state) {
        if (state.loading) return null
        const pdf = state.indexData.folders[state.bookData.folder][3]
        if (pdf && pdf.startsWith("https://")) {
            return pdf
        } else if (pdf && pdf.startsWith("-")) {
            return `${PDFS_BASE}${pdf}`
        } else {
           return `${PDFS_BASE}/${pdf}`
        }
    },
    /**
     * Errata, as { href, book, page }
     */
    errata (state) {
        if (state.loading) return null
        const errata = []
        const folderInfo = state.indexData.folders[state.bookData.folder]
        if (folderInfo.length > 4) {
            const errors = folderInfo[4]
            for (let key in errors) {
                if (state.displayMode === 'onePage') {
                    if (errors[key] && errors[key].find(p => p == state.currentPage))
                        errata.push(key)
                } else if (state.displayMode === 'twoPages') {
                    if (errors[key] && errors[key].find(p =>
                            p == getPagePaire(state) || p == getPageImpaire(state)
                        ))
                        errata.push(key)
                }
            }
        }
        return errata.map(location => { return {
            href: `#/${location}`,
            page: location.split('/')[1],
            book: state.indexData.books.filter(b => b[0] == location.split('/')[0])[0][1]
        }})
    },
    /**
     * Triggers the location hash change.
     */
    locationHash (state) {
        if (state.loading) return null
        const hash = `#/${state.currentBook}/${state.currentPage}`
        window.location.hash = hash
        CANONICAL_NODE.setAttribute('href', `${CANONICAL}/${hash}`)
        return hash
    },
    /**
     * Triggers the title change.
     */
    title (state, getters) {
        if (state.loading) return null
        const chapterInRoman = convertToRoman(getters.currentChapter ? getters.currentChapter.title : '')
        const title = `p.${state.currentPage}-${chapterInRoman}-${getters.currentBookDisplayName} (${DOCUMENT_TITLE})`
        document.title = title
        return title
    }
}

const actions = {
    /**
     * Called at the main component creation.
     */
    fetchInitData ({ commit }, locationHash) {
        fetch(`${BASE}index.json`)
        .then(response => response.json())
        .then(indexData => {
            var currentBook = indexData.default
            var currentPage = null 
            if (locationHash && (m = locationHash.match(/#\/(.+)\/(.+)/))) {
                currentBook = m[1]
                currentPage = parseInt(m[2])
            }
            fetch(`${BASE}jsons/${currentBook}.json`)
            .then(response => response.json())
            .then(bookData => {
                commit('init', {
                    indexData,
                    currentBook,
                    bookData,
                    currentPage: Number.isInteger(currentPage) && currentPage >= bookData.min && currentPage <= bookData.max ? currentPage : bookData.chapters[0][1]
                })
            })
        })
    },
    /**
     * Page change from the form input.
     */
    changePage ({ commit, state, getters, dispatch }, newValue) {
        const page = parseInt(newValue)
        if (page >= state.bookData.min && page <= state.bookData.max) {
            commit('changePageInSameBook', page)
        } else {
            if (page > state.bookData.max && getters.nextBook) {
                dispatch('changeBook', {
                    key: getters.nextBook,
                    page: newValue
                })
            } else if (page < state.bookData.min && getters.previousBook) {
                dispatch('changeBook', {
                    key: getters.previousBook,
                    page: newValue
                })
            }
        }
    },
    /**
     * Page increment from a button, or gesture.
     */
    incrementPage ({ commit, state, dispatch, getters }) {
        const page = getRightOrOnlyPage(state) + (state.displayMode === 'twoPages' ? 2 : 1)
        if (page >= state.bookData.min && page <= state.bookData.max) {
            commit('changePageInSameBook', page)
        } else {
            // go to the next book if applicable
            if (getters.nextBook)
                dispatch('changeBook', { key: getters.nextBook, page : 'min' })
        }
        if (state.displayMode === 'onePage') // scroll to the top
            document.body.scrollTop = document.documentElement.scrollTop = 0
    },
    /**
     * Page decrement from a button, or gesture.
     */
    decrementPage ({ commit, state, dispatch, getters }) {
        const page = getRightOrOnlyPage(state) - (state.displayMode === 'twoPages' ? 2 : 1)
        if (page >= state.bookData.min && page <= state.bookData.max) {
            commit('changePageInSameBook', page)
        } else {
            // go to the previous book if applicable
            if (getters.previousBook)
                dispatch('changeBook', { key: getters.previousBook, page: 'max' })
        }
    },
    /**
     * Changes the chapter, or go back to the chapter begin.
     */
    changeChapter ({ commit, state }, title) {
        const page = state.bookData.chapters.filter(c => c[0] == title)[0][1]
        commit('changePageInSameBook', page)
    },
    /**
     * Changes the book.
     */
    changeBook ({ commit }, { key, page }) {
        fetch(`${BASE}jsons/${key}.json`)
        .then(response => response.json())
        .then(bookData => {
            currentPage = bookData.chapters[0][1]
            if (page == 'max') {
                currentPage = bookData.max
            } else if (page == 'min') {
                currentPage = bookData.min
            } else if (Number.isInteger(page) && page >= bookData.min && page <= bookData.max) {
                currentPage = page
            }
            if (currentPage >= bookData.min && currentPage <= bookData.max) {
                commit('loadNewBook', {
                    currentBook: key,
                    bookData,
                    currentPage
                })
            } else {
                var nextBook, previousBook
                if (currentPage > bookData.max && (nextBook = getNextBook(state, key))) {
                    dispatch('changeBook', {
                        key: nextBook,
                        page: newValue
                    })
                } else if (currentPage < bookData.min && (previousBook = getPreviousBook(state, key))) {
                    dispatch('changeBook', {
                        key: previousBook,
                        page: newValue
                    })
                }    
            }
        })
    }
}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

const MainComponent = {
    el: '#main',
    store,
    created () {
        this.$store.dispatch('fetchInitData', window.location.hash)
        window.addEventListener('keydown', this.keyListener)
    },
    mounted () {
        const swipeElement = document.getElementById('hammer');
        if (swipeElement == null) console.warn("mounted: null element for hammer!")
        const mc = new Hammer(swipeElement);    
        mc.on('swipeleft', () => this.incrementPage())
        mc.on('swiperight', () => this.decrementPage())
        window.addEventListener('popstate', this.popStateListener)
    },
    destroyed () {
        window.removeEventListener('keydown', this.keyListener)
        window.removeEventListener('popstate', this.popStateListener)
    },    
    computed: {
        ...Vuex.mapState([
            'loading',
            'showInfo',
            'displayMode',
            'currentBook',
            'currentPage',
          ]),
        ...Vuex.mapGetters([
            'books',
            'chapters',
            'currentChapter',
            'currentPageImgSrc',
            'currentPageImgPaireSrc',
            'currentPageImgImpaireSrc',
            'bookInfo',
            'editionInfo',
            'pdfLink',
            'errata',
            'locationHash',
            'title'
        ])
    },
    methods: {
        changeSite (url) {
            window.location = url
        },
        popStateListener () {
            if (this.$store.loading) return
            const hash = window.location.hash
            if (hash && (m = hash.match(/#\/(.+)\/(.+)/))) {
                let hashBook = m[1]
                let hashPage = m[2]
                if (
                    this.$store.state.currentPage != parseInt(hashPage) ||
                    this.$store.state.currentBook != hashBook
                ) {
                    this.$store.dispatch('fetchInitData', hash)
                }
            }    
        },
        keyListener (event) {
            switch (event.key) {
                case 'ArrowRight':
                    this.incrementPage()
                    break
                case 'ArrowLeft':
                    this.decrementPage()
                    break
                case 'i':
                    this.toggleInfo()
                    break
                case 'v':
                    this.toggleDisplayMode()
                    break    
            }    
        },
        ...Vuex.mapMutations([
            'toggleInfo',
            'toggleDisplayMode'
        ]),
        ...Vuex.mapActions([
            'incrementPage',
            'decrementPage',
            'changePage',
            'changeChapter',
            'changeBook'
        ])
    }
}

const app = new Vue(MainComponent)

}