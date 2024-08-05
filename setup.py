from setuptools import setup, find_packages

setup(
    name="streamlit-timetable-canvas",
    version="0.0.1",
    author="Sze Yu Sim",
    author_email="szeyu.sim@embeddedllm.com",
    description="Streamlit component that allows you to generate timetable canvas",
    packages=find_packages(),
    include_package_data=True,
    package_data={
        'timetable_canvas_generator': [
            'frontend/build/*',
        ],
    },
    install_requires=[
        'streamlit>=0.63',
    ],
)
