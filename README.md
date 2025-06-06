# SecurePass

<div align="center">

![SecurePass Logo](https://img.shields.io/badge/SecurePass-Generator-blue)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A modern, secure password generator that combines cryptographic strength with human memorability.

[Live Demo](https://mgadaphy.github.io/SECUREPASS/) • [Features](#features) • [Installation](#installation) • [Usage](#usage) • [Security](#security) • [Contributing](#contributing)

</div>

## Overview

SecurePass is a powerful password generator that creates strong, memorable passwords by intelligently combining random characters with user-defined words. It's designed to help users create passwords that are both secure and easy to remember.

## Features

### 🔐 Advanced Password Generation
- **Customizable Length**: Generate passwords from 8 to 32 characters
- **Multiple Character Sets**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)
  - Numbers (0-9)
  - Special symbols (!@#$%^&*)
- **Real-time Strength Meter**: Powered by zxcvbn for accurate password strength assessment
- **Password History**: Local storage of recently generated passwords

### 🎯 Word-Based Generation
- **Custom Word Integration**: Add your own words to include in passwords
- **Smart Mixing**:
  - Mix words with random characters
  - Randomize word order
  - Optional word capitalization
- **Memorability**: Create passwords that are both secure and easy to remember

### 🛡️ Security Features
- **Ambiguous Character Exclusion**: Option to exclude similar-looking characters (l,1,I,0,O)
- **Local Processing**: All password generation happens in your browser
- **No Server Storage**: Passwords are never sent to any server
- **One-Click Copy**: Secure clipboard integration

### 🎨 User Experience
- **Theme Support**:
  - Light/Dark mode
  - System theme detection
  - Smooth theme transitions
- **Responsive Design**: Works seamlessly on all devices
- **Intuitive Interface**: Clean, modern UI with clear feedback
- **Toast Notifications**: Visual feedback for user actions

## Installation

### Option 1: Run Online
Visit the [Live Demo](https://mgadaphy.github.io/SECUREPASS/) to use SecurePass directly in your browser.

### Option 2: Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/mgadaphy/SECUREPASS.git
   ```

2. Navigate to the project directory:
   ```bash
   cd SECUREPASS
   ```

3. Open `index.html` in your web browser

No build process or dependencies required! The application runs entirely in the browser.

## Usage

1. **Generate a Password**:
   - Click the "Generate" button for a random password
   - Adjust the length using the slider
   - Select character sets to include

2. **Add Custom Words**:
   - Type words in the input field
   - Click the "+" button to add them
   - Words will be mixed with random characters

3. **Customize Generation**:
   - Toggle mixing options
   - Enable/disable word capitalization
   - Exclude ambiguous characters

4. **Copy Password**:
   - Click the copy icon next to the generated password
   - Password is copied to clipboard
   - Visual feedback confirms the action

## Security

- All password generation happens locally in your browser
- No data is sent to any server
- Passwords are not stored on any server
- Uses cryptographically secure random number generation
- Implements best practices for password generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

© 2023 SecurePass Generator | Created by [mogadonko.com](https://mogadonko.com)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [zxcvbn](https://github.com/dropbox/zxcvbn) for password strength estimation
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Font Awesome](https://fontawesome.com) for icons
