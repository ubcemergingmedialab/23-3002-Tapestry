function handleButtonClick(buttonNumber, event) {
    event.preventDefault(); // Prevent the default button behavior
  
    if (buttonNumber === 1) {
      // Action for Button 1
      console.log("Button 1 clicked!");
    } else if (buttonNumber === 2) {
      // Action for Button 2
      console.log("Button 2 clicked!");
    }
  }