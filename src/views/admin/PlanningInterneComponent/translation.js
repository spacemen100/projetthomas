// Define a mapping of English to French translations
const translationMap = {
    'Hello': 'Bonjour',
    'Welcome': 'Bienvenue',
    // Add more translations as needed
  };
  
  // Function to translate text within a specific DOM element
  function translateTextInElement(element) {
    let textContent = element.textContent.trim();
    if (translationMap[textContent]) {
      element.textContent = translationMap[textContent];
    }
  }
  
  // Find the element with the specified ID
  const schedulerElement = document.getElementById('reactSchedulerOutsideWrapper');
  
  // Translate text within the specified element
  translateTextInElement(schedulerElement);
  