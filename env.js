const sites = [
    {
        title: 'Bible de Sacy',
        url: 'https://bible.sacy.be'
    },
    {
        title: 'Heures de Port-Royal',
        url: 'https://heures.sacy.be'
    },
    {
        title: 'Bible de Royaumont',
        url: 'https://royaumont.sacy.be'
    }
]

const UI_ENV = {
    title: 'Bible de Sacy, ou de Port-Royal',
    canonical: 'https://bible.sacy.be',
    dataBasePath:'',
    uiPath: 'ui',
    bookSelectorLabel: 'L.',
    chapterSelectorLabel: 'Ch.',
    sites,
    links: [
        {
            title: 'rapporter une erreur',
            url: 'https://github.com/bible-sacy/bible-sacy.github.io/issues'
        },
        {
            title: 'code source du site web',
            url: 'https://github.com/bible-sacy/bible-sacy.github.io'
        },
        {
            title: 'autres œuvres de Port-Royal',
            url: 'https://www.sacy.be'
        }
    ]
}