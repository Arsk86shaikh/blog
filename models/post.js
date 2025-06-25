// models/post.js
const posts = [];
let nextId = 1;

class Post {
    constructor(title, content, date = new Date()) {
        this.id = nextId++;
        this.title = title;
        this.content = content;
        this.date = date; // Initialize with current date
    }

    static findAll() {
        // Sort posts by date in descending order
        return posts.sort((a, b) => b.date - a.date);
    }

    static create(postData) {
        const post = new Post(postData.title, postData.content);
        posts.push(post);
        return post;
    }

    static findById(id) {
        return posts.find(post => post.id === parseInt(id, 10));
    }

    static update(id, updatedPost) {
        const index = posts.findIndex(post => post.id === parseInt(id, 10));
        if (index !== -1) {
            posts[index] = {
                ...posts[index],
                ...updatedPost,
                date: new Date() 
            };
            return posts[index];
        }
        return null;
    }

    static delete(id) {
        const index = posts.findIndex(post => post.id === parseInt(id, 10));
        if (index !== -1) {
            posts.splice(index, 1);
            return true;
        }
        return false;
    }
}

export default Post;
