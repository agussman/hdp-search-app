import gensim, json, re, pickle, sys

stop_words = set([ 
    "by", "the", "of", "for", "and", "in", "to", 
    "over", "or", "with", "under", "no", "not", 
    "from", "at", "as", "without", "this", "who",
    "other", "they", "them", "also", "except", "on",
    "are", "is", "that", "is", "were", "was", "had",
    "that", "which", "it", "be", "use", "generally",
    "than", "through", "via", "between", "each",
    "those", "these", "have", "any", "now", "if", "should",
    "such", "has", "what", "into", "primarily", 
    "more", "comprises", "all", "can", "ie", "what", 
    "below", "see", "about", "its", "eg", "greater", 
    "their", "among", "after", "having","while", "an", "we", 
     "here", "you", "will", "your", "only", "likely", 
    "because", "etc", "shall", "his", "her", "ever", 
    "every", "then", "within", "likewise", "onto"
])

def clean_text(txt):    
    clean_words = []
    for w in txt.split():
        if w not in stop_words and re.search(r"^[A-Za-z].*[A-Za-z]$", w):
            w = re.sub(r"[^A-Za-z-]", "", w)
            if len(w) > 1:
                clean_words.append(w.lower())
    return clean_words

file_name = sys.argv[1]
txt = file_name.replace(".pdf", ".txt")

hdp = gensim.models.ldamodel.LdaModel.load("scripts/hdpModel")
dictionary = gensim.corpora.dictionary.Dictionary.load("scripts/hdpDictionary")

with open("public/txt/" + txt,"r") as f:
    txt = f.read()
corpus = dictionary.doc2bow(clean_text(txt))

with open("scripts/topic2words", "r") as f:
	topic2words = pickle.load(f)

topicsMix = hdp[corpus][0:3]

topics = []
for topicWeightPair in topicsMix:
	topic = str(topicWeightPair[0])
	topicWeight = topicWeightPair[1]
	topics.append( { "words" : topic2words[topic], "weight" : topicWeight } )

print json.dumps({ "response" : topics })