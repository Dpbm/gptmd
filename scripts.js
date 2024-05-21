const dataArea = document.getElementById('gpt-data');

function logError(error){
  console.error(`An error occurred during the data fetching\nError: ${error}`);
}

function noData(){
  const noDataText = document.createElement('h1');
  noDataText.className = 'noDataTitle'
  noDataText.innerText = 'No Data was found!';

  const noDataSubtitle = document.createElement('h2');
  noDataSubtitle.className = 'noDataSubtitle';
  noDataSubtitle.innerText = 'Try asking questions and then reopen the extension!';
  
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

function createMdFile(title, text){
  let mdData = `# ${title}\n`;

  for(let i = 0; i < text.length; i++)
    mdData += i % 2 == 0 ?
                `## ${text[i]}\n` :
                '```\n' + text[i] + '\n```\n\n';
  
  const mdBlob = new Blob([mdData], { type: 'text/plain' });
  const downloadElement = document.getElementById('export-file');
  downloadElement.href = URL.createObjectURL(mdBlob);
  downloadElement.download = `${title}-${new Date().toString()}.md`;
}

function appendData(title, text){

  if(!title && !text){
    noData();
    return;
  }


  const h1 = document.createElement('h1');
  h1.className = 'conversationTitle';
  h1.innerText = title;
  
  const downloadButton = document.createElement('a');
  downloadButton.innerText = 'download';
  downloadButton.id = 'export-file';
  downloadButton.className = 'exportMdFile';

  dataArea.appendChild(h1);
  dataArea.appendChild(downloadButton);

  createMdFile(title, text);
  
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

