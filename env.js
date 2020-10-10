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
        title: 'De l’Imitation de Jésus-Christ',
        url: 'https://imitation.sacy.be'
    },
    {
        title: 'Bible de Royaumont',
        url: 'https://royaumont.sacy.be'
    },
    {
        title: 'Considérations de Saint-Cyran',
        url: 'https://considerations.sacy.be'
    },
    {
        title: 'Théologie Familière de Saint-Cyran',
        url: 'https://theologie-familiere.sacy.be'
    },
    {
        title: 'Hiver - Bréviaire Le Tourneux',
        url: 'https://breviaire.sacy.be/hiver'
    },
    {
        title: 'Printemps - Bréviaire Le Tourneux',
        url: 'https://breviaire.sacy.be/printemps'
    },
    {
        title: 'Été - Bréviaire Le Tourneux',
        url: 'https://breviaire.sacy.be/ete'
    },
    {
        title: 'Automne - Bréviaire Le Tourneux',
        url: 'https://breviaire.sacy.be/automne'
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
            title: 'Remarque, erreur ? contact@sacy.be',
            url: 'mailto:contact@sacy.be'
        },
        {
            title: 'Code source du site web',
            url: 'https://github.com/bible-sacy/bible-sacy.github.io'
        },
        {
            title: 'Autres œuvres de Port-Royal',
            url: 'https://www.sacy.be'
        }
    ]
}