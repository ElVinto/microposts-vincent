import axios from 'axios';

// const url = 'http://localhost:5000/posts';

const url = 'posts';

class PostService{

    //  no need to instanciate
    static getPosts(){
        return new Promise ((resolve, reject) => {
            try {
                axios.get(url).then( res =>{
                    console.log(res.data);
                    resolve(
                        res.data.map(post => ({
                            ...post
                            // ,cretedAt: new Date()
                        }))
                    );
                })

                // loop over the returned array ;
            } catch (err) {
                reject(err);
            }
        })
    }

    static postQuery(transaction){
        return axios.post(url,transaction);
    }

    static deleteQuery(transaction){
        return axios.delete(url,transaction);
    }


}

export default PostService;