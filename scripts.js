const dataArea = document.getElementById('gpt-data');

function logError(error){
  console.error(`An error occurred during the data fetching\nError: ${error}`);
}

function noData(){
  const noDataText = document.createElement('h1');
  noDataText.className = 'noDataTitle'
  noDataText.innerText = 'No Data!';

  const noDataSubtitle = document.createElement('h2');
  noDataSubtitle.className = 'noDataSubtitle';
  noDataSubtitle.innerText = 'Try reopen the extension!';
  
  dataArea.appendChild(noDataText);
  dataArea.appendChild(noDataSubtitle);
}

function getQuestionTag(){
  const h2 = document.createElement('h2');
  h2.className = 'question';
  return h2;
}

function getAnswerTag(){
  const pre = document.createElement('pre');
  pre.className = 'answer';
  return pre;
}

function addToLocalStorage(title, text){
  browser.storage.local.set({title, text})
    .then(() => {}, logError);
}

function appendData(title, text){

  if(!title && !text){
    noData();
    return;
  }

  addToLocalStorage(title, text);

  const h1 = document.createElement('h1');
  h1.className = 'conversationTitle';
  h1.innerText = title;
  dataArea.appendChild(h1);

  for(let i = 0; i < text.length; i++){
    let element = i % 2 == 0 ? 
        getQuestionTag(): 
        getAnswerTag();
    element.innerText = text[i];
    dataArea.appendChild(element);
  }
}

(async() => {
  browser.tabs.executeScript(null, {file: "./getData.js"});
  
  try{
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    const chatgptTabId = tabs[0].id;

    browser.tabs.sendMessage(chatgptTabId, {})
      .then(({response}) => appendData(response.title, response.text))
      .catch((error) => {
        noData();
        logError(error);
      });

  }catch(error){
    noData();
    logError(error);
  }
})();

