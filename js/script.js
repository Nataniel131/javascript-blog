'use strict';

const opts =  {
    articleSelector: '.post',
    titleSelector: '.post-title',
    titleListSelector: '.titles',
    articleTagsSelector: '.post-tags .list',
    articleAuthorSelector: '.post-author',
    tagsListSelector: '.tags.list',
    authorsListSelector: '.authors.list',
    cloudClassCount: 4,
    cloudClassPrefix: 'tag-size-'
};

/** GenerateTitleLinks
 * To jest funkcja, która generuje listę tytułów w lewej kolumnie.
 * @param customSelector selector po którym będziemy wyszukiwać linków
 * @return lista tytułów
 * @example generateTitleLinks (); // html ul.title - 'Article 1, Article 3, Article 7...'
 */
const generateTitleLinks = function (customSelector = '') {

    const titleList = document.querySelector(opts.titleListSelector);

    const clearTitle = function () {
        titleList.innerHTML = '';
    };

    clearTitle();

    const articles = document.querySelectorAll(opts.articleSelector + customSelector);

    let html = '';

    for (let article of articles) {

        const articleId = article.getAttribute('id');

        const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

        html = html + linkHTML;
    }

    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {

        link.addEventListener('click', titleClickHandler);
    }
};


/** TitleClickHandler
 * To jest funkcja, która wyświetla artykuł po kliknięciu w link.
 * @param event Kliknięcie użytkownika
 * @return Wyświetlenie artykułu
 * @example titleClickHandler(event); // Kliknięcie w link 'href = #article-1' wyświetli artykuł 'id = article-1'
 */
const titleClickHandler = function (event) {

    event.preventDefault();

    const clickedElement = this;

    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');

    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    const articleSelector = clickedElement.getAttribute('href');

    const targetArticle = document.querySelector(articleSelector);

    targetArticle.classList.add('active');
};


/** CalculateTagsParams
 * To jest funkcja, która ma na celu podanie najmniejszej i największej liczby wystąpień tagów w obiekcie
 * @param tags Obiekt na który ma zadziałać funkcja
 * @return Największa i najmniejsza liczba wystąpień tagów w obiekcie
 * @example calculateTagsParams(allTags); // Zwraca obiekt 'params' o dwóch właściwościach 'min' i 'max'
 */
const calculateTagsParams = function (tags) {

    const params = {
        max: 0,
        min: 999999,
    };

    for (let tag in tags) {
        if(tags[tag] > params.max){
            params.max = tags[tag];
        }
        if(tags[tag] < params.min){
            params.min = tags[tag];
        }
    }

    return params;
};


/** CalculateTagsClass
 * To jest funkcja, która pobira argument count i params, zwracając klasę dla linku w chmurze tagów
 * @param count Ilość wystąpień danego tagu
 * @param params Obiekt który posiada własność 'min' i 'max'
 * @return Klasa dla linku zaczynająca się od 'tag-size-' i kończąca się na cyfsze od 1 do 5
 * @example calculateTagsClass(); // Zwraca klasę dla linku w chmurze tagów
 */
const calculateTagClass = function (count, params) {

    const classNumber = Math.floor(((count - params.min) / (params.max - params.min) ) * opts.cloudClassCount + 1 );

    const tagClass = opts.cloudClassPrefix + classNumber;

    return tagClass;
};


/** GenerateTags
 * To jest funkcja, która tworzy tagi w dolnej części środkowej kolumny wykorzystując atrybyt artykułu.
 * @return Tworzy tagi
 * @example generateTags (); // Kliknięcie w link do artykułu 1 wyświetli tagi: design, tutorials
 */
const generateTags = function () {

    let allTags = {};

    const articles = document.querySelectorAll(opts.articleSelector);

    for (let article of articles) {

        const tagsWrapper = article.querySelector(opts.articleTagsSelector);

        let html = '';

        const articleTags = article.getAttribute('data-tags');

        const articleTagsArray = articleTags.split(' ');

        for(let tag of articleTagsArray){

            const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

            html = html + ' ' + linkHTML;

            if (!allTags[tag]) {
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }
        }

        const tagList = document.querySelector(opts.tagsListSelector);

        const tagsParams = calculateTagsParams(allTags);

        let allTagsHTML = '';

        for (let tag in allTags) {

            allTagsHTML += '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + '<span>' + ' (' + allTags[tag] + ') ' + '</span></a></li>';
        }

        tagList.innerHTML = allTagsHTML;

        tagsWrapper.innerHTML = html;

        const links = document.querySelectorAll('.post-tags a, .list.tags a');

        for (let link of links) {

            link.addEventListener('click', tagClickHandler);
        }
    }
};


/** TagClickHandler
 * To jest funkcja, która usuwa wszystkim linkom tagów klasę "active" i nadaje ją wszystkim linką o klikniętym tagu
 * @param event Kliknięcie użytkownika
 * @return Dodaje klasę "active" na wszystkie linki klikniętego tagu
 * @example tagClickHandler (event); // Kliknięcie w link tagu "design" nada class = "active" na wszystkie linki tego tagu
 */
const tagClickHandler = function (event) {

    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const tag = href.replace('#tag-', '');

    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    for (let activeTagLink of activeTagLinks) {

        activeTagLink.classList.remove('active');
    }

    const targetTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    for (let targetTagLink of targetTagLinks) {

        targetTagLink.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
};


/** GenerateAuthors
 * To jest funkcja, która tworzy podpis autora w dolnej części środkowej kolumny wykorzystując atrybyt artykułu.
 * @return Tworzy podpis autora
 * @example generateAuthors (); // Kliknięcie w link do artykułu 1 wyświetli autora: Marion Berry
 */
const generateAuthors = function () {

    let allAuthors = {};

    const articles = document.querySelectorAll(opts.articleSelector);

    for (let article of articles) {

        const authorWrapper = article.querySelector(opts.articleAuthorSelector);

        const articleAuthor = article.getAttribute('data-author');

        const articleAuthorAddress = articleAuthor.replace(' ', '-');

        if (!allAuthors[articleAuthor]) {
            allAuthors[articleAuthor] = 1;
        } else {
            allAuthors[articleAuthor]++;
        }

        const linkHTML = '<a href="#A-' + articleAuthorAddress + '"><span>' + articleAuthor + '</span></a>';

        authorWrapper.innerHTML = linkHTML;

        const authorList = document.querySelector(opts.authorsListSelector);

        let allAuthorsHTML = '';

        for (let author in allAuthors) {

            const authorAtribute = author.replace(' ', '-');

            allAuthorsHTML += '<li><a href="#A-' + authorAtribute + '">' + author + ' (' + allAuthors[author] + ') ' + '</a></li>';
        }

        authorList.innerHTML = allAuthorsHTML;

        const links = document.querySelectorAll('.post-author a, .authors.list a');

        for (let link of links) {

            link.addEventListener('click', authorClickHandler);
        }
    }
};


/** AuthorClickHandler
 * To jest funkcja, która usuwa wszystkim linkom autorów klasę "active" i nadaje ją wszystkim linką o klikniętym autorze
 * @param event Kliknięcie użytkownika
 * @return Dodaje klasę "active" na wszystkie linki klikniętego autora
 * @example authorClickHandler (event); // Kliknięcie w link autora "Marion Berry" nada class = "active" na wszystkie linki tego autora
 */
const authorClickHandler = function (event) {

    event.preventDefault();

    const clickedElement = this;

    const href = clickedElement.getAttribute('href');

    const author = href.replace('#A-', '').replace('-', ' ');

    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#A-"]');

    for (let activeAuthorLink of activeAuthorLinks) {

        activeAuthorLink.classList.remove('active');
    }

    const targetAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

    for (let targetAuthorLink of targetAuthorLinks) {

        targetAuthorLink.classList.add('active');
    }

    generateTitleLinks('[data-author="' + author + '"]');
};


generateTitleLinks();

generateTags ();

generateAuthors ();
