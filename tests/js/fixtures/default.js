export const ziglite = {
    "routes": {
        "home": {
            "uri": "\/",
            "domain": null,
            "wheres": []
        },
        "regions.index": {
            "uri": "\/",
            "domain": "{region}.domain.test",
            "wheres": {
                "region": "[a-zA-Z0-9]+"
            }
        },
        "regions.map": {
            "uri": "map",
            "domain": "{region}.domain.test",
            "wheres": {
                "region": "[a-zA-Z0-9]+"
            }
        },
        "users.index": {
            "uri": "users",
            "domain": null,
            "wheres": []
        },
        "users.update": {
            "uri": "users\/update\/{user}",
            "domain": null,
            "wheres": []
        },
        "users.addresses.index": {
            "uri": "users\/addresses",
            "domain": null,
            "wheres": []
        },
        "users.addresses.create": {
            "uri": "users\/addresses\/create",
            "domain": null,
            "wheres": []
        },
        "posts": {
            "uri": "posts",
            "domain": null,
            "wheres": []
        },
        "posts.comments.index": {
            "uri": "posts\/{post}\/comments",
            "domain": null,
            "wheres": []
        },
        "posts.comments.import": {
            "uri": "posts\/{post}\/comments\/import",
            "domain": null,
            "wheres": []
        },
        "posts.archives.purge": {
            "uri": "posts\/archives\/purge",
            "domain": null,
            "wheres": []
        },
        "posts.archives.show": {
            "uri": "posts\/archives\/{post}",
            "domain": null,
            "wheres": []
        },
        "posts.archives.restore": {
            "uri": "posts\/archives\/restore\/{post}",
            "domain": null,
            "wheres": []
        }
    }
};
