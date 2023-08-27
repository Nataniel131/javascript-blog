'use strict';

const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post-author';


/** GenerateTitleLinks
 * To jest funkcja, która generuje listę tytułów w lewej kolumnie.
 * @param customSelector selector po którym będziemy wyszukiwać linków
 * @return lista tytułów
 * @example generateTitleLinks (); // html ul.title - 'Article 1, Article 3, Article 7...'
 */
const generateTitleLinks = function (customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);

    const clearTitle = function () {
        titleList.innerHTML = '';
    };

    clearTitle();

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);

    let html = '';

    for (let article of articles) {

        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;

        /* get the title from the title element */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';

        /* create HTML of the link */
        // titleList.insertAdjacentHTML("beforeend", linkHTML);

        /* insert link into titleList */
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

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute('href');

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
};


/** GenerateTags
 * To jest funkcja, która tworzy tagi w dolnej części środkowej kolumny wykorzystując atrybyt artykułu.
 * @return Tworzy tagi
 * @example generateTags (); // Kliknięcie w link do artykułu 1 wyświetli tagi: design, tutorials
 */
const generateTags = function () {

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

        /* find tags wrapper */
        const tagsWrapper = article.querySelector(optArticleTagsSelector);

        /* make html variable with empty string */
        let html = '';

        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');

        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');

        /* START LOOP: for each tag */
        for(let tag of articleTagsArray){

            /* generate HTML of the link */
            const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

            /* add generated code to html variable */
            html = html + ' ' + linkHTML;

        /* END LOOP: for each tag */
        }

        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;

        /* find all links to tags */
        const links = document.querySelectorAll('.post-tags a');

        /* START LOOP: for each link */
        for (let link of links) {

            /* add tagClickHandler as event listener for that link */
            link.addEventListener('click', tagClickHandler);

        /* END LOOP: for each link */
        }

    /* END LOOP: for every article: */
    }
};


/** TagClickHandler
 * To jest funkcja, która usuwa wszystkim linkom tagów klasę "active" i nadaje ją wszystkim linką o klikniętym tagu
 * @param event Kliknięcie użytkownika
 * @return Dodaje klasę "active" na wszystkie linki klikniętego tagu
 * @example tagClickHandler (event); // Kliknięcie w link tagu "design" nada class = "active" na wszystkie linki tego tagu
 */
const tagClickHandler = function (event) {

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');

    /* find all tag links with class active */
    const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

    /* START LOOP: for each active tag link */
    for (let activeTagLink of activeTagLinks) {

        /* remove class active */
        activeTagLink.classList.remove('active');

    /* END LOOP: for each active tag link */
    }

    /* find all tag links with "href" attribute equal to the "href" constant */
    const targetTagLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found tag link */
    for (let targetTagLink of targetTagLinks) {

        /* add class active */
        targetTagLink.classList.add('active');

    /* END LOOP: for each found tag link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
};


/** GenerateAuthors
 * To jest funkcja, która tworzy podpis autora w dolnej części środkowej kolumny wykorzystując atrybyt artykułu.
 * @return Tworzy podpis autora
 * @example generateAuthors (); // Kliknięcie w link do artykułu 1 wyświetli autora: Marion Berry
 */
const generateAuthors = function () {

    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);

    /* START LOOP: for every article: */
    for (let article of articles) {

        /* find author wrapper */
        const authorWrapper = article.querySelector(optArticleAuthorSelector);

        /* get author from data-author attribute */
        const articleAuthor = article.getAttribute('data-author');

        /* create address for href */
        const articleAuthorAddress = articleAuthor.replace(' ', '-');

        /* generate HTML of the link */
        const linkHTML = '<a href="#A-' + articleAuthorAddress + '"><span>' + articleAuthor + '</span></a>';

        /* insert HTML the link into the author wrapper */
        authorWrapper.innerHTML = linkHTML;

        /* find all links to author */
        const links = document.querySelectorAll('.post-author a');

        /* START LOOP: for each link */
        for (let link of links) {

            /* add authorClickHandler as event listener for that link */
            link.addEventListener('click', authorClickHandler);

        /* END LOOP: for each link */
        }

    /* END LOOP: for every article: */
    }
};


/** AuthorClickHandler
 * To jest funkcja, która usuwa wszystkim linkom autorów klasę "active" i nadaje ją wszystkim linką o klikniętym autorze
 * @param event Kliknięcie użytkownika
 * @return Dodaje klasę "active" na wszystkie linki klikniętego autora
 * @example authorClickHandler (event); // Kliknięcie w link autora "Marion Berry" nada class = "active" na wszystkie linki tego autora
 */
const authorClickHandler = function (event) {

    /* prevent default action for this event */
    event.preventDefault();

    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;

    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');

    /* make a new constant "author" and extract author from the "href" constant */
    const author = href.replace('#A-', '').replace('-', ' ');

    /* find all author links with class active */
    const activeAuthorLinks = document.querySelectorAll('a.active[href^="#A-"]');

    /* START LOOP: for each active author link */
    for (let activeAuthorLink of activeAuthorLinks) {

        /* remove class active */
        activeAuthorLink.classList.remove('active');

    /* END LOOP: for each active author link */
    }

    /* find all author links with "href" attribute equal to the "href" constant */
    const targetAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');

    /* START LOOP: for each found author link */
    for (let targetAuthorLink of targetAuthorLinks) {

        /* add class active */
        targetAuthorLink.classList.add('active');

    /* END LOOP: for each found author link */
    }

    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-author="' + author + '"]');
};


generateTitleLinks();

generateTags ();

generateAuthors ();
