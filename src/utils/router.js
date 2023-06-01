const writer = (to) => {
    const deleArr = [];
    document.head.childNodes.forEach(item => {
        switch (item.tagName) {
            case "META":
                deleArr.push(item);
                break;
            case "TITLE":
                const name = to.params.name ? to.params.name + ' · ' : ''
                const t = to.meta.title || ''
                document.title = `${name}${t}Lagrange DAO`;
                break;
        }
    });
    deleArr.forEach(item => {
        document.head.removeChild(item);
    })
    const metas = document.createElement("META");
    const creatArr = [{
            name: "referrer",
            content: "no-referrer",
            charset: "utf-8"
        },
        {
            "http-equiv": "X-UA-Compatible",
            content: "IE=edge"
        },
        {
            name: "viewport",
            content: "width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no,minimal-ui"
        },
        {
            name: "format-detection",
            content: "telephone=no"
        },
        {
            name: "renderer",
            content: "webkit|ie-comp|ie-stand"
        },
        {
            "http-equiv": "X-UA-Compatible",
            content: "IE=Edge,chrome=1"
        },
        {
            content: "telephone=no",
            name: "format-detection"
        },
        {
            content: "email=no",
            name: "format-detection"
        },
        {
            name: "keywords",
            content: "Lagrange DAO"
        },
        {
            name: "description",
            content: "Lagrange DAO is a DAO for data value realization. It provides data sharing & analytic spaces for Decentralized science(DeSci)."
        },
        {
            property: "og:title",
            content: "Lagrange DAO"
        },
        {
            property: "og:type",
            content: "website"
        },
        {
            property: "og:url",
            content: "https://lagrangedao.org"
        },
        {
            property: "og:image",
            content: "https://lagrangedao.org/logo.png"
        },
        {
            property: "og:image:type",
            content: "image/png"
        },
        {
            property: "og:image:width",
            content: "300"
        },
        {
            property: "og:image:height",
            content: "300"
        },
        {
            property: "og:image:alt",
            content: "Lagrange DAO logo"
        },
        {
            property: "og:description",
            content: "Lagrange DAO is a DAO for data value realization. It provides data sharing & analytic spaces for Decentralized science(DeSci)."
        }
    ];
    const tmpArr = to.meta.data ? to.meta.data.concat() : [];
    if (tmpArr.length > 0) {
        to.meta.data.forEach((item, index) => {
            creatArr.forEach((ele, ind) => {
                if (Object.keys(item)[0] == Object.keys(ele)[0]) {
                    creatArr[ind] = JSON.parse(JSON.stringify(item));
                    tmpArr.splice(index, 1);
                }
            });
        });
    }
    const eleArr = creatArr.concat(tmpArr);
    const creatFrag = document.createDocumentFragment();
    eleArr.forEach(ele => {
        creatFrag.append(metas.cloneNode());
        Object.entries(ele).forEach(item => {
            creatFrag.lastChild.setAttribute(item[0], item[1]);
        });
    });
    document.head.prepend(creatFrag);
}

export default writer