'use strict';

function titleClickHandler(event) {
  event.preventDefault();

  const activeLinks = document.querySelectorAll('.titles a.active'),
    clickedElement = this;

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts .post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  let linkHref = clickedElement.getAttribute('href').slice(1),
    selectedArticle = document.getElementById(linkHref);
  selectedArticle.classList.add('active');
}

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optAuthorSelector = '.post-author',
  optArticleTagsSelector ='.post-tags .list',
  optCloudClassCount = 3,
  optCloudClassPrefix = 'tag-size-';


function generateTitleLinks(customSelector = '') {

  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  const articles = document.querySelectorAll(optArticleSelector + customSelector);

  let html = '';

  for(let article of articles){
    const articleId = article.getAttribute('id'),
      articleTitle = article.querySelector(optTitleSelector).innerHTML,
      linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();

function calculateTagsParams(tags) {
  const params = {
    max: 0,
    min: 999999
  };
  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times');
    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min,
    normalizedMax = params.max - params.min,
    percentage = normalizedCount / normalizedMax,
    classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  let allTags = {};
  const articles = document.querySelectorAll(optArticleSelector); // tu się zastanawiałem po co mam drugi raz deklarować stałą i chciałem ją zmienić na globalna, ale przypomniało mi się, że przynajmniej w jquery jesli zmienną jest funkcja to wykonuje się ona w miejscu deklaracji, więc pewnie dlatego ją deklarują drugi raz i postanowiłem to zostawić, aby nie obciążało strony

  for(let article of articles){
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    let html = '',
      articleTags = article.getAttribute('data-tags');
    const articleTagsArray = articleTags.split(' '); // w takich właśnie miejscach jak ta i 3 linie wyżej zastanawiam się czy używać się powinno let czy const, bo często podają const, ale będzie on zawierał zawsze inną wartość (w tym przypadku tagi się zmieniają), ale może po prostu za bardzo szukam dziury w całym
    for(let tag of articleTagsArray){
      html = html + '<li><a href="#tag-'+tag+'">'+tag+'</a></li>';
      if(!allTags.hasOwnProperty(tag)){
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagWrapper.innerHTML = html;
  }
  const tagList = document.querySelector('.tags'),
    tagsParams = calculateTagsParams(allTags);
  let allTagsHTML = '';

  for(let tag in allTags) {
    const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) + '" href="#tag-'+tag+'">' + tag + '</a></li>';
    allTagsHTML += tagLinkHTML;
  }
  tagList.innerHTML = allTagsHTML;
}
generateTags();

function generateAuthors() {
  let allAuthors = {};
  const articles = document.querySelectorAll(optArticleSelector);

  for(let article of articles){
    const authorWrapper = article.querySelector(optAuthorSelector);
    let html = '',
      articleAuthor = article.getAttribute('data-author');
    html = html + '<a href="#author-'+articleAuthor.toLowerCase().replace(' ','-')+'">'+articleAuthor+'</a>';
    if(!allAuthors.hasOwnProperty(articleAuthor)){
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    authorWrapper.innerHTML = html;
  }
  const authorsList = document.querySelector('.authors');
  let allAuthorsHTML = '';

  for(let author in allAuthors) {
    const authorLinkHTML = '<li><a href="#author-'+author.toLowerCase()+'">' + author + ' (' + allAuthors[author] + ') </a></li>';
    allAuthorsHTML += authorLinkHTML;
  }
  authorsList.innerHTML = allAuthorsHTML;
}
generateAuthors();

function tagClickHandler(event) {
  event.preventDefault();

  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    tag = href.replace('#tag-', ''),
    activeLinkSelector = 'a.active[href^="#tag-"]',
    activeLinks = document.querySelectorAll(activeLinkSelector);
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  const linkSameHrefSelector = 'a[href="' + href + '"]',
    linkSameHrefs = document.querySelectorAll(linkSameHrefSelector);

  for(let linkSameHref of linkSameHrefs){
    linkSameHref.classList.add('active');
  }
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function authorClickHandler(event) {
  event.preventDefault();

  const clickedElement = this,
    href = clickedElement.getAttribute('href'),
    author = href.replace('#author-', '')
      .replace('-',' ')
      .split(' ')
      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
      .join(' '),
    activeLinkSelector = 'a.active[href^="#author-"]',
    activeLinks = document.querySelectorAll(activeLinkSelector);
  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  const linkSameHrefSelector = 'a[href="' + href + '"]',
    linkSameHrefs = document.querySelectorAll(linkSameHrefSelector);

  for(let linkSameHref of linkSameHrefs){
    linkSameHref.classList.add('active');
  }
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToTags() {
  const activeLinkSelector = 'a[href^="#tag-"]',
    activeLinks = document.querySelectorAll(activeLinkSelector);

  for(let activeLink of activeLinks){
    activeLink.addEventListener('click', tagClickHandler);
  }
}

function addClickListenersToAuthors() {
  const activeLinkSelector = 'a[href^="#author-"]',
    activeLinks = document.querySelectorAll(activeLinkSelector);

  for(let activeLink of activeLinks){
    activeLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToTags();
addClickListenersToAuthors();

