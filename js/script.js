const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles';

/** GenerateTitleLinks
     * To jest funkcja, która generuje listę tytułów.
     * @return lista tytułów
     * @example generateTitleLinks; // html ul.title - 'Article 1, Article 2, Article 3...'
     */
const generateTitleLinks = function(){

    /* remove contents of titleList */
	const titleList = document.querySelector(optTitleListSelector);

	const clearTitle = function(){
        titleList.innerHTML = '';
    }

    clearTitle()

    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector);

    let html = '';

    for(let article of articles){
        
        /* get the article id */
        const articleId = article.getAttribute("id");

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
    
    const links = document.querySelectorAll('.titles a')

    for(let link of links){
        link.addEventListener('click', titleClickHandler);
    }
}

/** TitleClickHandler
     * To jest funkcja, która wyświetla artykuł po kliknięciu.
     * @param event Kliknięcie użytkownika
     * @return Wyświetlenie artykułu 
     * @example titleClickHandler(event); // Kliknięcie w link 'href = #article-1' wyświetli artykuł 'id = article-1'
     */ 
const titleClickHandler = function(event){
    event.preventDefault();
    const clickedElement = this;

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for(let activeLink of activeLinks){
        activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for(let activeArticle of activeArticles){
        activeArticle.classList.remove('active');
    }

    /* get 'href' attribute from the clicked link */
    const articleSelector = clickedElement.getAttribute("href");

    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(articleSelector);

    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
}

generateTitleLinks();