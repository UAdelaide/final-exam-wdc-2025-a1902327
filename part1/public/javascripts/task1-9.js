const { createApp } = Vue;

createApp({
    data() {
        return {
            dog_img_link: '',
            visible: false,
            button_pos: { top: 200, left: window.innerWidth - 200 / 2 - 75 },
            move : 0
        };
    },
    methods: {
        getDog() {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);

                        if (data.status === 'success') {
                            this.dog_img_link = data.message;
                        }
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                    }
                } else {
                    console.error("Request failed with status:", xhr.status);
                }
            };

            xhr.onerror = () => {
                console.error("Transfer error");
            };

            xhr.open('GET', 'https://dog.ceo/api/breeds/image/random');
            xhr.send();
        },

        showDogPics() {
            this.visible = true;
        },

        moveButton() {
            if (this.move < 5) {
                this.move++;
                var top = Math.random() * (window.innerHeight - 100);
                var left = Math.random() * (window.innerWidth - 200);
                this.button_pos = { top: top, left: left };
            }
        }
    },
    mounted() {
        this.getDog();
    }
}).mount('#app');