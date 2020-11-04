let hiatuses = ["ϊ", "ῒ", "ΐ", "ϋ", "ΰ", "ῢ"]
let latin_acute = {"a": "á", "e": "é", "i": "í", "ï": "í", "o": "ó", "u": "ú", "y": "ý"}
let greek_acute = {"α": "ά", "ε": "έ", "η": "ή", "ι": "ί", "ο": "ό", "υ": "ύ", "ω": "ώ", "ϊ": "ΐ", "ϋ": "ΰ"}
let diaeresis = {"ι": "ϊ", "υ": "ϋ"}
let acute_diaresis = {"ι": "ΐ", "υ": "ΰ"}
let hiatus_not_accent = ["ϊ", "ϋ"]
let fix_double_unicode = {"μ": "µ", "∆": "δ", "o": "ο", "v": "ν", "a": "α",
                      "t": "τ", "z": "ζ", "h": "η", "x": "χ"}

class Greek {
    constructor(string) {
        this.setString(string)
        this.i = 0
        this.nor = ''

        let alpha = this.alpha.bind(this)
        let gamma = this.gamma.bind(this)
        let epsilon = this.epsilon.bind(this)
        let mu = this.mu.bind(this)
        let nu = this.nu.bind(this)
        let omicron = this.omicron.bind(this)
        this.letters = {
            "α": alpha,
            "β": () => "v",
            "γ": gamma,
            "δ": () => "d",
            "ε": epsilon,
            "ζ": () => "z",
            "η": () => "i",
            "θ": () => "th",
            "ι": () => "i",
            "ϊ": () => "i",
            "κ": () => "k",
            "λ": () => "l",
            "µ": mu,
            "ν": nu,
            "ξ": () => "x",
            "ο": omicron,
            "π": () => "p",
            "ρ": () => "r",
            "σ": () => "s",
            "ς": () => "s",
            "τ": () => "t",
            "υ": () => "y",
            "ϋ": () => "y",
            "φ": () => "f",
            "χ": () => "kh",
            "ψ": () => "ph",
            "ω": () => "o"
        }
    }

    strip_accents(s) {
        return s.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    setString(s) {
        let lowered = s.toLowerCase()
        this.accented = lowered
        this.string = this.strip_accents(lowered)
        this.accent_idx = find_accent(this.accented)
        this.gre_accent_idx = this.accent_idx
    }

    getString() {
        return this.string
    }


    nextIsHiatus() {
        if (this.i < this.string.length - 1){
            return hiatuses.includes(this.accented[this.i + 1])
        }
        else
            return false
    }

    isvowel(i) {
        if (i < 0 || i >= this.string.length)
            return false
        return "αεηιουω".includes(this.string[i].toLowerCase())
    }
    
    add (s, n, add_accent=0) {
        this.nor += s
        this.accent_idx += add_accent;
        if (this.i < this.gre_accent_idx) {
            this.accent_idx -= n - s.length
        }
        this.i += n
    }

    norwegian() {
        if ((this.accented.match(/ /g) || []).length > 0) {
            // several words
            let original_accented = this.accented
            let words = this.accented.split(" ")
            let nor_words = words.map((s) => { // transliterate one at a time and join
                this.setString(s)
                return this.norwegian(s);
            })

            this.setString(original_accented)
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
            if (char in this.letters){
                let nor_char = this.letters[char]()
                if (nor_char)
                    // normal uncomplicated letters
                    this.add(nor_char, 1)
            }
            else { // things that aren't letters
                this.add(char, 1)
            }
        }
        let finished = this.add_accent()
        this.i = 0;
        this.nor = ''
        return finished
    }
    alpha() {
        if (this.next === "ι") {
            if (this.nextIsHiatus()) {
                this.add("ai", 2)
            } else {
                this.add("e", 2)
            }
        } else if (this.next === "υ") {
            if (this.nextIsHiatus()) {
                this.add("ay", 2);
            } else {
                if (this.gre_accent_idx === this.i + 1) {
                    this.add("av", 2, -1)
                } else {
                    this.add("av", 2)
                }
            }
        } else {
            this.add("a", 1)
        }
        return 0
    }

    gamma() {
        if (this.next === "ι" && this.gre_accent_idx === this.i + 1) {
            this.add("ji", 2)
        } else if (this.next === "ι" && this.isvowel(this.i + 2)) {
            this.add("j", 2)
        } else if ("ιευ".includes(this.next)) {
            this.add("j", 1)
        } else if (this.next === "γ") {
            this.add("ng", 2)
        } else if (this.next === "χ") {
            this.add("nkh", 2)
        } else if (this.next === "κ") {
            if (this.isvowel(this.i-1)) {
                this.add("ng", 2)
            } else {
                this.add("g", 2)
            }
        } else {
            this.add("g", 1)
        }
        return 0

    }

    epsilon() {
        if (this.next === "ι") {
            if (this.nextIsHiatus()) {
                this.add("ei", 2)
            } else {
                this.add("i", 2)
            }
        } else if (this.next === "υ") {
            if (this.nextIsHiatus()) {
                this.add("eu", 2)
            } else {
                if (this.gre_accent_idx === this.i + 1) {
                    this.add("ev", 2, -1)
                } else {
                    this.add("ev", 2)
                }
            }
        } else {
            this.add("e", 1)
        }
        return 0
    }

    mu(){
        if (this.next === "π") {
            if (this.isvowel(this.i - 1)) {
                this.add("mb", 2)
            } else {
                this.add("b", 2)
            }
        } else {
            this.add("m", 1)
        }
        return 0

    }

    nu(){
        if (this.next === "τ") {
            if (this.isvowel(this.i - 1)) {
                this.add("nd", 2)
            } else {
                this.add("d", 2)
            }
        } else {
            this.add("n", 1)
        }
        return 0

    }    
    omicron(){
        if (this.next === "ι") {
            if (this.nextIsHiatus()) {
                this.add("oi", 2)
            } else {
                this.add("i", 2)
            }
        } else if (this.next === "υ") {
            this.add("ou", 2)
        } else {
            this.add("o", 1)
        }
        return 0

    }

    get next() {
        if (this.i < this.string.length - 1)
            return this.string[this.i + 1]
        else
            return null;
    }

    titleCase(s) {
        return s.charAt(0).toUpperCase() + s.substr(1)
    }

    add_accent() {
        if (this.accent_idx === -1) {
            return this.titleCase(this.nor)
        }
        let idx = this.accent_idx
        let accent = latin_acute[this.nor[idx]]
        if (accent === undefined)
            return this.titleCase(this.nor)
        let withaccent = this.nor.substr(0,idx) + accent + this.nor.substr(idx+1)
        return this.titleCase(withaccent)
    }
}


function is_accented(c) {
    if (hiatus_not_accent.includes(c))
        return false
    return c.normalize('NFD') !== c
}

function find_accent(s) {
    for (let i = 0; i < s.length; i++) {
        let c = s.charAt(i)
        if (is_accented(c)) {
            return i;
        }
    }
    return -1
}
export { Greek, greek_acute, diaeresis, acute_diaresis }
