addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  let variants;
  let finalPage;
  const url = 'https://cfw-takehome.developers.workers.dev/api/variants'
  const fetchResult = fetch(new Request(url))
  const response = await fetchResult;
  
  if (response.ok) {
    let jsonData = await response.json();
    variants = jsonData.variants
  } else {
    throw Error(response.statusText);
  }
  
  const fetchPage = fetch(new Request(getUrl(variants)))
  const res = await fetchPage
  if (res.ok) {
    finalPage = await res.text();
  } else {
    throw Error(res.statusText);
  }
  return rewriter.transform( new Response (finalPage, {
    headers: { 'content-type': 'text/html'},
  }));
}

var counter;
function getUrl(variants) {
  counter = Math.round(Math.random());
  return variants[counter];
}


class ElementHandler {
  constructor(elementName) {
    this.elementName = elementName;
  }
  element(element) {
    element.replace('<title>Parikshith</title>',{ html: true })
  }
}

class AttributeRewriter {
  constructor(attributeName) {
    this.attributeName = attributeName
  }
 
  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    let link, site;
    if (counter % 2 == 0) {
      site = "GitHub";
      link = "https://github.com/ParikshithKedilayaM";
    } else {
      site = "LinkedIn";
      link = "https://www.linkedin.com/in/parikshith-kedilaya";
    }
    if (attribute == 'title') {
      element.replace('<h1 class="text-lg leading-6 font-medium text-gray-900" id="title">Welcome User</h1>',{html:true});
    } else if (attribute == 'description') {
      element.replace('<p class="text-sm leading-5 text-gray-500" id="description"> \
      Click on the below link to go to my '+ site +' page! \
      </p>', { html: true });
    } else  if (attribute == 'url') {
      let classAttribute = element.getAttribute('class')
      element.replace('<a class="' + classAttribute + '" href="'+ link +'" id="url"> Click here: '+ site +'</a>', {html: true})
    }
  }
}

const rewriter = new HTMLRewriter()
  .on('title', new ElementHandler('title'))
  .on('h1', new AttributeRewriter('id'))
  .on('p', new AttributeRewriter('id'))
  .on('a', new AttributeRewriter('id'))
