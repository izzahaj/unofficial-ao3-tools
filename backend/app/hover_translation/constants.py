import re

TRANSLATION_PATTERN = re.compile(r"\{(.*?)\s\[(.+?)\]\}")

CLASS_TEMPLATE = "ch{chapter_id}text{index}"

ANCHOR_TEMPLATE = (
    '<a name="return{class_str}" rel="nofollow" id="return{class_str}"></a>'
    '<a href="#return{class_str}" class="{class_str}" rel="nofollow">'
    '<span class="hide">{original}</span></a>'
)

CSS_TEMPLATE = """
#workskin a.{class_str}:after {{
  content: "{original}";
}}

#workskin a.{class_str}:hover:after,
#workskin a.{class_str}:focus:after {{
  content: "{translated}";
  display: inline;
  background-color: #FFF;
  color: #2a2a2a;
  border-bottom: 1px solid #FFF;
  position: relative;
  margin: 0px;
  padding: 0px;
}}
"""
