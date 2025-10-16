class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__toggle'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.querySelector('.chatbox__input'),
            messagesContainer: document.querySelector('.messages__container'),
            resetButton: document.querySelector('.chatbox__reset'),
            downloadButton: document.querySelector('.chatbox__download'),
            profileImage: document.getElementById('profile-image')
        };

        this.state = false;
        this.messages = [];
        this.selectedCategory = null;
        
        // Category to image mapping
        this.categoryImages = {
            accreditation: 'accreditation.png',
            framework: 'framework.png',
            qualifications: 'qualifications.png',
            recognition: 'recognition.png',
            equivalency: 'equivalency.png',
            apel: 'apel.png',
            faq: 'faq.png',
            default: 'mqa-logo.png'
        };

        // APEL sub-categories
        this.apelSubCategories = {
            'apel-a': 'APEL.A - Access to Higher Education',
            'apel-c': 'APEL.C - Credit Transfer', 
            'apel-q': 'APEL.Q - Qualifications',
            'apel-m': 'APEL.M - Micro-credentials'
        };

        // Pre-determined answers for each category
        this.predefinedAnswers = {
            accreditation: {
                "What is the accreditation process timeline?": "The accreditation process typically takes 6-9 months from application submission to final decision. This includes document review, site visits, and committee evaluation.",
                "What documents are required for accreditation?": "Required documents include: institutional profile, program specifications, quality assurance documents, faculty qualifications, facility details, and financial sustainability reports.",
                "How to check accreditation status?": "You can check accreditation status through the MQA portal at portal.mqa.gov.my or contact our accreditation division directly at accreditation@mqa.gov.my",
                "What are the accreditation fees?": "Accreditation fees vary based on program level and institution type. Basic fees start from RM 5,000 for certificate programs to RM 15,000 for doctoral programs.",
                "How to appeal an accreditation decision?": "Appeals must be submitted within 30 days of decision notification. Submit a formal appeal letter with supporting documents to appeals@mqa.gov.my"
            },
            framework: {
                "What is the Malaysian Qualifications Framework?": "The MQF is a unified national qualifications framework that organizes qualifications according to a set of criteria based on learning outcomes.",
                "How does the MQF work?": "The MQF functions as a reference point for qualifications, ensuring quality and facilitating credit transfer and recognition across education sectors.",
                "What are the MQF levels?": "The MQF has 8 levels from Level 1 (Certificate) to Level 8 (Doctoral), with each level specifying learning outcomes and credit requirements.",
                "Where can I find the latest MQA policies?": "Latest policies are available on the official MQA website at www.mqa.gov.my/policies or through the MQA digital library.",
                "How often are framework standards updated?": "Framework standards are reviewed every 3-5 years to ensure relevance with industry needs and international best practices."
            },
            qualifications: {
                "What are the standards for new programs?": "New programs must meet MQF level descriptors, have adequate resources, qualified faculty, and align with national education goals.",
                "How to develop a new qualification?": "Follow the MQA program development guidelines, conduct needs analysis, design curriculum based on learning outcomes, and submit proposal through the online system.",
                "What are the program standards requirements?": "Requirements include: clear learning outcomes, appropriate assessment methods, qualified teaching staff, adequate facilities, and quality assurance mechanisms.",
                "How to modify an existing qualification?": "Submit modification proposal through MQA portal, providing justification and impact analysis. Major changes may require re-accreditation.",
                "Where can I find the qualification standards handbook?": "The handbook is available for download at www.mqa.gov.my/standards-handbook"
            },
            recognition: {
                "How to get a qualification recognized?": "Submit application through MQA recognition portal with complete academic transcripts, certificate copies, and program details.",
                "What is the recognition process?": "Process includes document verification, qualification assessment against MQF, committee review, and issuance of recognition certificate.",
                "Which qualifications need recognition?": "All foreign qualifications and local qualifications from non-accredited institutions require MQA recognition for official purposes.",
                "How long does recognition take?": "Standard processing time is 2-3 months for complete applications. Complex cases may take longer.",
                "What documents are needed for recognition?": "Required: academic transcripts, certificates, program specifications, institution details, and identification documents."
            },
            equivalency: {
                "What is qualification equivalency?": "Equivalency establishes the comparable MQF level for qualifications obtained from different education systems.",
                "How to apply for equivalency?": "Apply through MQA equivalency portal with complete academic documents and pay the assessment fee.",
                "Which countries' qualifications are recognized?": "MQA recognizes qualifications from countries with established quality assurance systems and mutual recognition agreements.",
                "What is the equivalency assessment process?": "Assessment compares learning outcomes, program duration, content, and assessment methods against MQF standards.",
                "How long does equivalency assessment take?": "Standard assessment takes 4-6 weeks. Additional verification may extend this period."
            },
            apel: {
                "What is APEL?": "APEL (Accreditation of Prior Experiential Learning) recognizes skills and knowledge gained through work and life experiences.",
                "Who can apply for APEL?": "Malaysian citizens aged 21+ with relevant work experience can apply for APEL assessment for entry to programs or credit transfer.",
                "How does APEL work?": "Candidates document their learning experiences, submit portfolio for assessment, and may undergo interviews or practical tests.",
                "What are the APEL requirements?": "Minimum 3 years relevant experience, portfolio evidence, and meeting specific program entry requirements.",
                "How to apply for APEL assessment?": "Register through APEL online system, prepare learning portfolio, and submit for assessment with required fees."
            },
            // APEL sub-categories
            'apel-a': {
                "What is APEL.A?": "APEL.A (Access) allows individuals with work experience to enter higher education programs without formal academic qualifications.",
                "Who is eligible for APEL.A?": "Malaysian citizens aged 21+ with minimum 3 years relevant work experience in the field of study.",
                "How to apply for APEL.A?": "Apply through the APEL online portal, submit portfolio of experiential learning, and attend assessment interview.",
                "What documents are needed for APEL.A?": "Required: Identification documents, work experience evidence, portfolio, and application form.",
                "What is the APEL.A assessment process?": "Assessment includes portfolio review, interview, and sometimes practical tests to verify learning outcomes."
            },
            'apel-c': {
                "What is APEL.C?": "APEL.C (Credit Transfer) allows recognition of prior learning for credit exemption in academic programs.",
                "How many credits can I get through APEL.C?": "Maximum 50% of total program credits can be obtained through APEL.C, subject to institutional policies.",
                "What types of learning qualify for APEL.C?": "Work experience, professional training, online courses, and other verifiable learning experiences.",
                "How to apply for APEL.C credit transfer?": "Submit application through participating institutions with evidence of prior learning.",
                "What is the cost of APEL.C assessment?": "Assessment fees vary by institution, typically ranging from RM 200-500 per credit hour."
            },
            'apel-q': {
                "What is APEL.Q?": "APEL.Q (Qualifications) provides formal recognition of experiential learning leading to full qualifications.",
                "What qualifications are available through APEL.Q?": "Certificate, Diploma, and Advanced Diploma levels in various fields.",
                "How long does APEL.Q assessment take?": "Complete assessment process typically takes 3-6 months depending on qualification level.",
                "What are the APEL.Q requirements?": "Minimum 5 years relevant experience, comprehensive portfolio, and successful assessment.",
                "Are APEL.Q qualifications recognized?": "Yes, APEL.Q qualifications are recognized under the Malaysian Qualifications Framework."
            },
            'apel-m': {
                "What is APEL.M?": "APEL.M (Micro-credentials) recognizes specific skills and competencies through short, focused learning programs.",
                "What types of micro-credentials are available?": "Digital skills, technical competencies, professional development, and industry-specific skills.",
                "How long do APEL.M programs take?": "Typically 2-6 months depending on the complexity of skills being assessed.",
                "Are APEL.M credentials stackable?": "Yes, multiple micro-credentials can be combined toward larger qualifications.",
                "How to register for APEL.M?": "Register through approved training providers or the MQA APEL portal."
            },
            faq: {
                "How to contact MQA directly?": "Call 03-7968 7002, email enquiry@mqa.gov.my, or visit MQA headquarters at Menara MQA, Cyberjaya.",
                "Where is MQA headquarters located?": "MQA Headquarters: Malaysian Qualifications Agency, Menara MQA, Lingkaran Cyber Point Timur, 63000 Cyberjaya, Selangor.",
                "What are MQA's operating hours?": "Monday-Friday: 8:00 AM - 5:00 PM. Closed on weekends and public holidays.",
                "How to file a complaint?": "Submit complaints through MQA portal, email complaint@mqa.gov.my, or call the complaints hotline at 03-7968 7029.",
                "Where can I download official forms?": "All official forms available at www.mqa.gov.my/forms or through the MQA digital services portal."
            }
        };
        
        this.init();
    }

    init() {
        this.loadChatHistory();
        this.initEventListeners();
        
        // Initialize the chat if it's active
        if (this.state) {
            this.renderStoredMessages();
        }
    }

    initEventListeners() {
        const { openButton, sendButton, inputField, resetButton, downloadButton } = this.args;

        // Open/close chat
        openButton.addEventListener('click', () => this.toggleState());
        
        // Send message
        sendButton.addEventListener('click', () => this.onSendButton());
        
        // Enter key to send
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.onSendButton();
            }
        });

        // Reset chat
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetChat());
        }

        // Download chat
        if (downloadButton) {
            downloadButton.addEventListener('click', () => this.downloadChat());
        }
    }

    loadChatHistory() {
        const savedChat = localStorage.getItem('mqa_chat_history');
        if (savedChat) {
            try {
                const chatData = JSON.parse(savedChat);
                this.messages = chatData.messages || [];
                this.selectedCategory = chatData.selectedCategory || null;
                
                if (this.selectedCategory) {
                    this.updateProfileImage(this.selectedCategory);
                }
            } catch (e) {
                console.error('Error loading chat history:', e);
                this.clearChatHistory();
            }
        }
    }

    saveChatHistory() {
        const chatData = {
            messages: this.messages,
            selectedCategory: this.selectedCategory,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('mqa_chat_history', JSON.stringify(chatData));
    }

    clearChatHistory() {
        localStorage.removeItem('mqa_chat_history');
        this.messages = [];
        this.selectedCategory = null;
    }

    renderStoredMessages() {
        const { messagesContainer } = this.args;
        messagesContainer.innerHTML = '';
        
        if (this.messages.length === 0) {
            this.showWelcomeMessage();
            setTimeout(() => this.showMainCategories(), 100);
            return;
        }
        
        this.messages.forEach(msg => {
            this.renderMessage(msg.text, msg.type, msg.timestamp, false);
        });
        
        if (!this.selectedCategory && this.state) {
            setTimeout(() => this.showMainCategories(), 100);
        }
        
        this.scrollToBottom();
    }

    toggleState() {
        this.state = !this.state;
        const { chatBox } = this.args;

        if (this.state) {
            chatBox.classList.add('chatbox--active');
            if (this.messages.length === 0) {
                this.showWelcomeMessage();
                setTimeout(() => this.showMainCategories(), 100);
            } else {
                this.renderStoredMessages();
            }
        } else {
            chatBox.classList.remove('chatbox--active');
        }
    }

    showWelcomeMessage() {
        this.addMessage("Welcome to MQABot! 👋", 'operator');
        this.addMessage("I'm here to help you with information about MQA services, accreditation, qualifications, and more. Please choose which category best suits your inquiries:", 'operator');
    }

    showMainCategories() {
        const existingSelection = this.args.messagesContainer.querySelector('.category-selection');
        if (existingSelection) {
            existingSelection.remove();
        }
        
        const categoriesHTML = `
            <div class="category-selection">
                <div class="category-tabs">
                    <button class="category-tab" data-category="accreditation">Accreditation Process & Status</button>
                    <button class="category-tab" data-category="framework">MQA Framework</button>
                    <button class="category-tab" data-category="qualifications">Qualification Standards</button>
                    <button class="category-tab" data-category="recognition">Recognition of Qualification</button>
                    <button class="category-tab" data-category="equivalency">Equivalency of Qualification</button>
                    <button class="category-tab" data-category="apel">APEL</button>
                    <button class="category-tab" data-category="faq">Frequently Asked Questions</button>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = categoriesHTML;
        this.args.messagesContainer.appendChild(container);
        
        container.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.selectedCategory = tab.dataset.category;
                this.addMessage(`Selected: ${tab.textContent}`, 'visitor');
                container.remove();
                this.updateProfileImage(this.selectedCategory);
                
                // Handle APEL category separately
                if (this.selectedCategory === 'apel') {
                    setTimeout(() => this.showApelSubCategories(), 100);
                } else {
                    setTimeout(() => this.showCategoryQuestions(), 100);
                }
            });
        });
        
        this.scrollToBottom();
    }

    showApelSubCategories() {
        const existingSelection = this.args.messagesContainer.querySelector('.category-selection');
        if (existingSelection) {
            existingSelection.remove();
        }
        
        const subCategoriesHTML = `
            <div class="category-selection">
                <p class="questions-header">APEL has 4 main components. Please choose one:</p>
                <div class="category-tabs">
                    <button class="category-tab" data-category="apel-a">APEL.A - Access to Higher Education</button>
                    <button class="category-tab" data-category="apel-c">APEL.C - Credit Transfer</button>
                    <button class="category-tab" data-category="apel-q">APEL.Q - Qualifications</button>
                    <button class="category-tab" data-category="apel-m">APEL.M - Micro-credentials</button>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = subCategoriesHTML;
        this.args.messagesContainer.appendChild(container);
        
        container.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const subCategory = tab.dataset.category;
                this.selectedCategory = subCategory;
                this.addMessage(`Selected: ${this.apelSubCategories[subCategory]}`, 'visitor');
                container.remove();
                this.updateProfileImage('apel'); // Keep APEL image for all sub-categories
                setTimeout(() => this.showSubCategoryQuestions(subCategory), 100);
            });
        });
        
        this.scrollToBottom();
    }

    showSubCategoryQuestions(subCategory) {
        const questions = {
            'apel-a': [
                "What is APEL.A?",
                "Who is eligible for APEL.A?",
                "How to apply for APEL.A?",
                "What documents are needed for APEL.A?",
                "What is the APEL.A assessment process?"
            ],
            'apel-c': [
                "What is APEL.C?",
                "How many credits can I get through APEL.C?",
                "What types of learning qualify for APEL.C?",
                "How to apply for APEL.C credit transfer?",
                "What is the cost of APEL.C assessment?"
            ],
            'apel-q': [
                "What is APEL.Q?",
                "What qualifications are available through APEL.Q?",
                "How long does APEL.Q assessment take?",
                "What are the APEL.Q requirements?",
                "Are APEL.Q qualifications recognized?"
            ],
            'apel-m': [
                "What is APEL.M?",
                "What types of micro-credentials are available?",
                "How long do APEL.M programs take?",
                "Are APEL.M credentials stackable?",
                "How to register for APEL.M?"
            ]
        };

        const existingQuestions = this.args.messagesContainer.querySelector('.popular-questions');
        if (existingQuestions) {
            existingQuestions.remove();
        }

        const categoryQuestions = questions[subCategory] || [];
        const questionsHTML = `
            <div class="popular-questions">
                <p class="questions-header">Common questions about ${this.apelSubCategories[subCategory]}:</p>
                <div class="question-tabs">
                    ${categoryQuestions.map(q => 
                        `<button class="question-tab">${q}</button>`
                    ).join('')}
                    <button class="question-tab custom-question-tab">Ask a custom question</button>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = questionsHTML;
        this.args.messagesContainer.appendChild(container);
        
        container.querySelectorAll('.question-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const question = tab.textContent;
                container.remove();
                
                if (question === "Ask a custom question") {
                    this.addMessage("Ask a custom question", 'visitor');
                    this.showCustomQuestionPrompt();
                } else {
                    this.addMessage(question, 'visitor');
                    this.showPredefinedAnswer(question);
                }
            });
        });
        
        this.scrollToBottom();
    }

    showCategoryQuestions() {
        const questions = {
            accreditation: [
                "What is the accreditation process timeline?",
                "What documents are required for accreditation?",
                "How to check accreditation status?",
                "What are the accreditation fees?",
                "How to appeal an accreditation decision?"
            ],
            framework: [
                "What is the Malaysian Qualifications Framework?",
                "How does the MQF work?",
                "What are the MQF levels?",
                "Where can I find the latest MQA policies?",
                "How often are framework standards updated?"
            ],
            qualifications: [
                "What are the standards for new programs?",
                "How to develop a new qualification?",
                "What are the program standards requirements?",
                "How to modify an existing qualification?",
                "Where can I find the qualification standards handbook?"
            ],
            recognition: [
                "How to get a qualification recognized?",
                "What is the recognition process?",
                "Which qualifications need recognition?",
                "How long does recognition take?",
                "What documents are needed for recognition?"
            ],
            equivalency: [
                "What is qualification equivalency?",
                "How to apply for equivalency?",
                "Which countries' qualifications are recognized?",
                "What is the equivalency assessment process?",
                "How long does equivalency assessment take?"
            ],
            apel: [
                "What is APEL?",
                "Who can apply for APEL?",
                "How does APEL work?",
                "What are the APEL requirements?",
                "How to apply for APEL assessment?"
            ],
            faq: [
                "How to contact MQA directly?",
                "Where is MQA headquarters located?",
                "What are MQA's operating hours?",
                "How to file a complaint?",
                "Where can I download official forms?"
            ]
        };

        const existingQuestions = this.args.messagesContainer.querySelector('.popular-questions');
        if (existingQuestions) {
            existingQuestions.remove();
        }

        const categoryQuestions = questions[this.selectedCategory] || [];
        const questionsHTML = `
            <div class="popular-questions">
                <p class="questions-header">Common questions about ${this.getCategoryName(this.selectedCategory)}:</p>
                <div class="question-tabs">
                    ${categoryQuestions.map(q => 
                        `<button class="question-tab">${q}</button>`
                    ).join('')}
                    <button class="question-tab custom-question-tab">Ask a custom question</button>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = questionsHTML;
        this.args.messagesContainer.appendChild(container);
        
        container.querySelectorAll('.question-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const question = tab.textContent;
                container.remove();
                
                if (question === "Ask a custom question") {
                    this.addMessage("Ask a custom question", 'visitor');
                    this.showCustomQuestionPrompt();
                } else {
                    this.addMessage(question, 'visitor');
                    this.showPredefinedAnswer(question);
                }
            });
        });
        
        this.scrollToBottom();
    }

    showCustomQuestionPrompt() {
        const promptHTML = `
            <div class="popular-questions">
                <p class="questions-header">Type your question in the input field below:</p>
                <p class="questions-note">You can ask any question related to ${this.getCategoryName(this.selectedCategory)}</p>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = promptHTML;
        this.args.messagesContainer.appendChild(container);
        
        this.args.inputField.focus();
        this.scrollToBottom();
    }

    showPredefinedAnswer(question) {
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.removeTypingIndicator();
            
            const answer = this.predefinedAnswers[this.selectedCategory]?.[question];
            if (answer) {
                this.addMessage(answer, 'operator');
                setTimeout(() => this.showFollowUpOptions(), 500);
            } else {
                this.addMessage("I'm sorry, I don't have a pre-defined answer for that question. Please try asking in your own words.", 'operator');
                setTimeout(() => this.showFollowUpOptions(), 500);
            }
        }, 1000);
    }

    showFollowUpOptions() {
        const isApelSubCategory = this.selectedCategory && this.selectedCategory.startsWith('apel-');
        
        const followUpHTML = `
            <div class="popular-questions">
                <p class="questions-header">Need more information?</p>
                <div class="question-tabs">
                    ${isApelSubCategory ? 
                        '<button class="question-tab" data-action="back-to-apel">Back to APEL Categories</button>' : 
                        '<button class="question-tab" data-action="more-questions">Show more questions</button>'
                    }
                    <button class="question-tab" data-action="change-category">Choose different category</button>
                    <button class="question-tab" data-action="contact-mqa">Contact MQA directly</button>
                    <button class="question-tab" data-action="custom-question">Ask a custom question</button>
                </div>
            </div>
        `;
        
        const container = document.createElement('div');
        container.innerHTML = followUpHTML;
        this.args.messagesContainer.appendChild(container);
        
        container.querySelectorAll('.question-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const action = tab.dataset.action;
                container.remove();
                
                switch(action) {
                    case 'more-questions':
                        this.showCategoryQuestions();
                        break;
                    case 'back-to-apel':
                        this.selectedCategory = 'apel';
                        this.showApelSubCategories();
                        break;
                    case 'change-category':
                        this.selectedCategory = null;
                        this.updateProfileImage(null);
                        this.showMainCategories();
                        break;
                    case 'contact-mqa':
                        this.addMessage("For direct assistance, please contact MQA:\n\n📞 Phone: 03-7968 7002\n📧 Email: enquiry@mqa.gov.my\n🌐 Website: www.mqa.gov.my\n📍 Address: Menara MQA, Lingkaran Cyber Point Timur, 63000 Cyberjaya, Selangor", 'operator');
                        break;
                    case 'custom-question':
                        this.showCustomQuestionPrompt();
                        break;
                }
            });
        });
        
        this.scrollToBottom();
    }

    getCategoryName(category) {
        const names = {
            accreditation: "Accreditation Process & Status",
            framework: "MQA Framework",
            qualifications: "Qualification Standards",
            recognition: "Recognition of Qualification",
            equivalency: "Equivalency of Qualification",
            apel: "APEL",
            faq: "Frequently Asked Questions",
            // APEL sub-categories
            'apel-a': "APEL.A - Access to Higher Education",
            'apel-c': "APEL.C - Credit Transfer",
            'apel-q': "APEL.Q - Qualifications", 
            'apel-m': "APEL.M - Micro-credentials"
        };
        return names[category] || "this topic";
    }

    updateProfileImage(category) {
        const { profileImage } = this.args;
        
        if (!profileImage) return;
        
        // Remove all category classes
        profileImage.className = '';
        
        if (category && this.categoryImages[category]) {
            const imageName = this.categoryImages[category];
            profileImage.src = `/static/images/${imageName}`;
            profileImage.classList.add(`profile-image--${category}`);
        } else {
            profileImage.src = '/static/images/mqa-logo.png';
        }
    }

    onSendButton() {
        const { inputField } = this.args;
        const text = inputField.value.trim();
        
        if (text === '') return;

        this.addMessage(text, 'visitor');
        inputField.value = '';
        
        if (!this.selectedCategory) {
            this.addMessage("Please select a category first", 'operator');
            setTimeout(() => this.showMainCategories(), 500);
            return;
        }
        
        // Handle custom user input - send to backend
        this.showTypingIndicator();
        
        fetch('/predict', {
            method: 'POST',
            body: JSON.stringify({ 
                message: text,
                category: this.selectedCategory  // Make sure category is included
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            this.removeTypingIndicator();
            
            if (data.error) {
                this.addMessage(`Error: ${data.error}`, 'operator');
            } else if (data.answer) {
                this.addMessage(data.answer, 'operator');
                // Show sources if available
                if (data.sources && data.sources.length > 0) {
                    const sourcesText = `📚 Sources: ${data.sources.join(', ')}`;
                    this.addMessage(sourcesText, 'operator');
                }
                setTimeout(() => this.showFollowUpOptions(), 500);
            } else {
                this.addMessage('No response received from server.', 'operator');
            }
        })
        .catch(error => {
            this.removeTypingIndicator();
            console.error('API Error:', error);
            // Fallback to predefined answers if API fails
            const fallbackAnswer = this.predefinedAnswers[this.selectedCategory]?.[text] || 
                                 "I'm having trouble connecting right now. Please try again or contact MQA directly at enquiry@mqa.gov.my";
            this.addMessage(fallbackAnswer, 'operator');
            setTimeout(() => this.showFollowUpOptions(), 500);
        });
    }

    addMessage(text, type) {
        const timestamp = new Date().toISOString();
        this.messages.push({ text, type, timestamp });
        this.saveChatHistory();
        this.renderMessage(text, type, timestamp, true);
    }

    renderMessage(text, type, timestamp, scroll = true) {
        const { messagesContainer } = this.args;
        const messageElement = document.createElement('div');
        messageElement.classList.add('messages__item', `messages__item--${type}`);
        
        const time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageContent = type === 'operator' ? this._ensureUrlSafety(text) : this._escapeHtml(text);
        
        messageElement.innerHTML = `
            <div class="message__text">${messageContent}</div>
            <div class="message__time">${time}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        if (scroll) {
            this.scrollToBottom();
        }
    }

    resetChat() {
        if (confirm("Are you sure you want to reset the chat? All conversation history will be lost.")) {
            this.clearChatHistory();
            this.args.messagesContainer.innerHTML = '';
            this.updateProfileImage(null);
            this.showWelcomeMessage();
            setTimeout(() => this.showMainCategories(), 100);
        }
    }

    downloadChat() {
        if (this.messages.length === 0) {
            alert("No chat history to download.");
            return;
        }

        const chatContent = this.formatChatForDownload();
        const blob = new Blob([chatContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        const time = new Date().toTimeString().slice(0, 8).replace(/:/g, '-');
        
        a.href = url;
        a.download = `mqa_chat_${date}_${time}.txt`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }

    formatChatForDownload() {
        let content = "MQA Chat Conversation Log\n";
        content += "==========================\n\n";
        content += `Generated: ${new Date().toLocaleString()}\n`;
        content += `Category: ${this.selectedCategory ? this.getCategoryName(this.selectedCategory) : 'Not selected'}\n`;
        content += "==========================\n\n";
        
        this.messages.forEach(msg => {
            const date = new Date(msg.timestamp);
            const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const sender = msg.type === 'operator' ? 'MQA Bot' : 'You';
            const message = this._stripHtml(msg.text).replace(/\n/g, ' ');
            
            content += `[${time}] ${sender}: ${message}\n`;
        });
        
        content += "\n==========================\n";
        content += "End of conversation log";
        
        return content;
    }

    _stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    _ensureUrlSafety(html) {
        return html.replace(/href="(.*?)"/g, (match, url) => {
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                return `href="${url}" target="_blank" rel="noopener noreferrer"`;
            }
            return `href="#" onclick="return false;"`;
        });
    }

    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showTypingIndicator() {
        const { messagesContainer } = this.args;
        const typingElement = document.createElement('div');
        typingElement.classList.add('typing-indicator');
        typingElement.id = 'typing-indicator';
        typingElement.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        messagesContainer.appendChild(typingElement);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }

    scrollToBottom() {
        const { messagesContainer } = this.args;
        if (messagesContainer) {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
}

// Initialize the chatbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chatbox();
});