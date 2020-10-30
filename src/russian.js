let vowels = ["а", "э", "ы", "у", "о", "я", "е", "ё", "ю", "и"]
let fix_double_unicode = {
    "a": "а",
    "b": "в",
    "e": "е",
    "ë": "ё",
    "і": "i",
    "m": "м",
    "h": "н",
    "o": "о",
    "p": "р",
    "c": "с",
    "t": "т",
    "y": "у",
    "x": "х",
}

class Russian {
    constructor(string) {
        this.setString(string)
        this.i = 0
        this.nor = ''

        let e = this.e.bind(this)
        let yo = this.yo.bind(this)
        let back_yer = this.back_yer.bind(this)
        let front_yer = this.front_yer.bind(this)
        let yu = this.yu.bind(this)
        let ya = this.ya.bind(this)

        this.letters = {
            "а": () => "a",
            "а́": () => "á",
            "б": () => "b",
            "в": () => "v",
            "г": () => "g",
            "д": () => "d",
            "е": e,
            "ё": yo,
            "ж": () => "zj",
            "з": () => "z",
            "и": () => "i",
            "и́": () => "í",
            "й": () => "j",
            "к": () => "k",
            "л": () => "l",
            "м": () => "m",
            "н": () => "n",
            "о": () => "o",
            "п": () => "p",
            "р": () => "r",
            "с": () => "s",
            "т": () => "t",
            "у": () => "u",
            "ф": () => "f",
            "х": () => "kh",
            "ц": () => "ts",
            "ч": () => "tsj",
            "ш": () => "sj",
            "щ": () => "sjtsj",
            "ъ": back_yer,
            "ы": () => "y",
            "ь": front_yer,
            "э": () => "e",
            "ю": yu,
            "я": ya,
        }

    }

    setString(s) {
        this.string = s.toLowerCase()
        this.string = this.string.replace(/’/g, "");
    }

    getString() {
        return this.string
    }

    isvowel(i) {
        if (i < 0 || i >= this.string.length)
            return false
        return vowels.includes(this.string[i].toLowerCase())
    }

    add(s, n) {
        this.nor += s
        this.i += n
    }

    norwegian() {
        if ((this.string.match(/ /g) || []).length > 0) {
            // several words
            let original = this.string
            let words = this.string.split(" ")
            let nor_words = words.map((s) => { // transliterate one at a time and join
                this.setString(s)
                return this.norwegian(s);
            })

            this.setString(original)
            return nor_words.join(' ')
        }
        this.i = 0;
        this.nor = ''
        for (let key in fix_double_unicode) {
            // replace similar unicode characters with the ones we like
            var re = new RegExp(key, "g")
            this.string = this.string.replace(re, fix_double_unicode[key])
        }
        while (this.i < this.string.length) {
            let char = this.string.charAt(this.i)
            if (char in this.letters) {
                let nor_char = this.letters[char]()
                if (nor_char)
                    // normal uncomplicated letters
                    this.add(nor_char, 1)
            }
            else { // things that aren't letters
                this.add(char, 1)
            }
        }
        this.i = 0;
        this.nor = this.nor.replace(/jj/g, "j")
        let finished = this.nor
        this.nor = ''
        return this.titleCase(finished)
    }

    e() {
        if (this.i === 0 || this.isvowel(this.i - 1)) {
            this.add("je", 1)
        } else {
            this.add("e", 1)
        }
    }

    yo() {
        if ("чшщ".includes(this.prev)) {
            this.add("o", 1)
        } else if ("сз".includes(this.prev)) {
            this.add("io", 1)
        } else {
            this.add("jo", 1)
        }
    }

    back_yer() {
        if ("зс".includes(this.prev) && "её".includes(this.next)) {
            this.add("i", 1)
        } else if ("зс".includes(this.prev) && this.next === "я") {
            this.add("ia", 2)
        } else if ("зс".includes(this.prev) && this.next === "ю") {
            this.add("iu", 2)
        } else {
            this.add("", 1)
        }
    }

    front_yer() {
        if ("зс".includes(this.prev) && vowels.includes(this.next)) {
            this.add("i", 1)
        } else if(!this.isvowel(this.i - 1) && this.isvowel(this.i + 1)) {
            this.add("j", 1)
        } else {
            this.add("", 1)
        }
    }

    yu() {
        if ("зсц".includes(this.prev)) {
            this.add("iu", 1)
        } else {
            this.add("ju", 1)
        }

    }
    ya() {
        if (this.prev === "ь") {
            if ("зсц".includes(this.string[this.i-2])) {
                this.add("a", 1)
            } else {
                this.add("ja", 1)
            }
        } else if ("зсц".includes(this.prev)) {
            this.add("ia", 1)
        } else {
            this.add("ja", 1)
        }
    }

    get next() {
        if (this.i < this.string.length - 1)
            return this.string[this.i + 1]
        else
            return null;
    }

    get prev() {
        if (this.i > 0)
            return this.string[this.i - 1]
        else
            return null;
    }
    titleCase(s) {
        return s.charAt(0).toUpperCase() + s.substr(1)
    }
}

export { Russian }